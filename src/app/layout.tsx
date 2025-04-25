import type { Metadata, Viewport } from "next";
import { Manrope, Outfit } from 'next/font/google';
import ClientLayout from './ClientLayout';
import ThemeRegistry from './ThemeRegistry';
import "./globals.css";

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "LinguaAI - Your Conversational Language Learning Assistant",
  description: "Learn languages through natural conversation with AI. Practice speaking, get instant feedback, and improve your language skills in a comfortable, beige-themed environment.",
  keywords: ["language learning", "AI tutor", "conversational learning", "language practice", "speaking practice"],
  authors: [{ name: "LinguaAI Team" }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f5f5dc',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${outfit.variable}`}>
      <body>
        <ThemeRegistry>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeRegistry>
      </body>
    </html>
  );
}
