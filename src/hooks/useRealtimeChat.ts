import { useCallback, useRef, useState, useEffect } from 'react';

type UseRealtimeChatProps = {
  nativeLanguage: string;
  desiredLanguage: string;
  setResponseText: (text: string) => void;
};

type UseRealtimeChatReturn = {
  startConversation: () => Promise<void>;
  stopConversation: () => void;
  isRunning: boolean;
  stream: MediaStream | null;
  transcript: string[];
  error: string | null;
  audioEl: React.RefObject<HTMLAudioElement | null>;
  pc: React.MutableRefObject<RTCPeerConnection | null>;
  dc: React.MutableRefObject<RTCDataChannel | null>;
  appendCustomMessage: (msg: string) => void;
};

export function useRealtimeChat({
  nativeLanguage,
  desiredLanguage,
  setResponseText,
}: UseRealtimeChatProps): UseRealtimeChatReturn {
  const [isRunning, setIsRunning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pc = useRef<RTCPeerConnection | null>(null);
  const dc = useRef<RTCDataChannel | null>(null);
  const audioEl = useRef<HTMLAudioElement>(null);

  // Clean up all resources
  const cleanup = useCallback(() => {
    setIsRunning(false);

    // Stop all media tracks
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);

    // Close data channel
    if (dc.current) {
      try {
        dc.current.close();
      } catch (err) {
        console.warn('Failed to close data channel:', err);
      }
      dc.current = null;
    }

    // Close peer connection
    if (pc.current) {
      try {
        pc.current.close();
      } catch (err) {
        console.warn('Failed to close peer connection:', err);
      }
      pc.current = null;
    }

    // Remove audio element src
    if (audioEl.current) {
      audioEl.current.srcObject = null;
    }
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const startConversation = useCallback(async () => {
    setError(null);
    if (isRunning) return;

    try {
      // 1. Get mic access
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(micStream);
      setIsRunning(true);

      // 2. Fetch ephemeral key with robust error handling
      const res = await fetch('/api/realtime-session');
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Ephemeral key request failed: ${text}`);
      }
      const data = await res.json();
      const EPHEMERAL_KEY = data.client_secret?.value;
      if (!EPHEMERAL_KEY) throw new Error('Failed to get ephemeral key');

      // 3. Setup WebRTC
      pc.current = new RTCPeerConnection();

      // 4. Setup audio element for playback (attach to DOM via ref)
      if (audioEl.current) {
        audioEl.current.autoplay = true;
        pc.current.ontrack = (e) => {
          audioEl.current!.srcObject = e.streams[0];
        };
      }

      // 5. Add mic track
      micStream.getTracks().forEach((track) => pc.current!.addTrack(track, micStream));

      // 6. Data channel for events
      dc.current = pc.current.createDataChannel('oai-events');
      dc.current.addEventListener('message', (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed.text) {
            setResponseText(parsed.text);
            setTranscript((prev) => [...prev, parsed.text]);
          }
        } catch (err) {
          console.warn('Failed to parse data channel message as JSON:', e.data, err);
          setResponseText(e.data);
          setTranscript((prev) => [...prev, e.data]);
        }
      });

      // 7. Create offer and set local description
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);

      // 8. Send offer to OpenAI and get answer
      const sdpRes = await fetch(
        `https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`,
        {
          method: 'POST',
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${EPHEMERAL_KEY}`,
            'Content-Type': 'application/sdp',
          },
        }
      );
      if (!sdpRes.ok) {
        const text = await sdpRes.text();
        console.warn('OpenAI SDP negotiation failed:', text);
        throw new Error(`OpenAI SDP exchange failed: ${text}`);
      }
      const answer = {
        type: 'answer' as RTCSdpType,
        sdp: await sdpRes.text(),
      };
      await pc.current.setRemoteDescription(answer);

      // ✅ Send session.update over the data channel
      const sessionUpdateEvent = {
        type: 'session.update',
        session: {
          instructions: `You are a helpful ${desiredLanguage} tutor.`,
          voice: 'shimmer',
          text: true,
          audio: true,
          output_audio_format: 'aac_24000',
        },
      };
      dc.current?.send(JSON.stringify(sessionUpdateEvent));
      console.log('[LinguaAI] Sent session.update');
      
      // ✅ Send initial user message and request response
      const userItemEvent = {
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `Hola, ¿puedes ayudarme a practicar ${desiredLanguage}?`,
            },
          ],
        },
      };
      dc.current?.send(JSON.stringify(userItemEvent));
      
      const responseCreateEvent = {
        type: 'response.create',
        response: {
          modalities: ['audio', 'text'],
        },
      };
      dc.current?.send(JSON.stringify(responseCreateEvent));
      console.log('[LinguaAI] Sent response.create');    } catch (err: any) {
      setError(err?.message || 'Unknown error');
      cleanup();
    }
  }, [isRunning, setResponseText, nativeLanguage, desiredLanguage, cleanup]);

  const stopConversation = useCallback(() => {
    cleanup();
  }, [cleanup]);

  // Allow appending a custom/system message to the transcript
  const appendCustomMessage = useCallback((msg: string) => {
    setTranscript((prev) => [...prev, msg]);
  }, []);

  return {
    startConversation,
    stopConversation,
    isRunning,
    stream,
    transcript,
    error,
    audioEl,
    pc,
    dc,
    appendCustomMessage,
  };
}
