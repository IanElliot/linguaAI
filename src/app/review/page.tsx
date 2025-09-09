'use client';

import React, { useState } from 'react';
import { Box, Paper, Typography, Container, Button, Card, CardContent, Box as MuiBox } from '@mui/material';
import Navbar from '../components/Navbar';

// Mock vocabulary data
const mockVocabulary = [
  { id: 1, word: 'Hola', translation: 'Hello', context: 'Greeting someone', difficulty: 'Easy' },
  { id: 2, word: 'Gracias', translation: 'Thank you', context: 'Expressing gratitude', difficulty: 'Easy' },
  { id: 3, word: 'Por favor', translation: 'Please', context: 'Making polite requests', difficulty: 'Easy' },
  { id: 4, word: '¿Cómo estás?', translation: 'How are you?', context: 'Asking about well-being', difficulty: 'Medium' },
  { id: 5, word: 'Buenos días', translation: 'Good morning', context: 'Morning greeting', difficulty: 'Easy' },
];

export default function Review() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);

  const currentWord = mockVocabulary[currentIndex];

  const handleNext = () => {
    setShowTranslation(false);
    setCurrentIndex((prev) => (prev + 1) % mockVocabulary.length);
  };

  const handlePrevious = () => {
    setShowTranslation(false);
    setCurrentIndex((prev) => (prev - 1 + mockVocabulary.length) % mockVocabulary.length);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f9f6f1',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Navbar />
      
      <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              mb: 1.5,
              fontWeight: 700,
              textAlign: 'center',
              color: 'primary.main',
              textShadow: '0 2px 4px rgba(247, 148, 29, 0.1)',
            }}
          >
            Vocabulary Review
          </Typography>

          <Typography 
            variant="subtitle1" 
            sx={{ 
              mb: 4,
              color: 'text.secondary',
              textAlign: 'center',
              fontWeight: 400,
            }}
          >
            Practice and reinforce your language learning
          </Typography>

          <Card 
            sx={{ 
              width: '100%',
              maxWidth: 600,
              mb: 4,
              bgcolor: '#f9f6f1',
              borderRadius: '12px',
              boxShadow: 'none',
              border: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h3" 
                component="div" 
                sx={{ 
                  mb: 3,
                  textAlign: 'center',
                  color: 'primary.main',
                  fontWeight: 700,
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                }}
              >
                {currentWord.word}
              </Typography>
              
              {showTranslation && (
                <MuiBox sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 2,
                  animation: 'fadeIn 0.3s ease-out',
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      textAlign: 'center',
                      color: 'text.primary',
                      fontWeight: 600,
                    }}
                  >
                    {currentWord.translation}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary',
                      textAlign: 'center',
                      fontStyle: 'italic',
                    }}
                  >
                    {currentWord.context}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      textAlign: 'center',
                      bgcolor: 'rgba(247, 148, 29, 0.1)',
                      py: 0.5,
                      px: 2,
                      borderRadius: '4px',
                      display: 'inline-block',
                      mx: 'auto',
                    }}
                  >
                    Difficulty: {currentWord.difficulty}
                  </Typography>
                </MuiBox>
              )}
            </CardContent>
          </Card>

          <MuiBox sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            maxWidth: 400,
          }}>
            <Button
              onClick={() => setShowTranslation(!showTranslation)}
              variant="contained"
              fullWidth
              sx={{ 
                py: 1.5,
                borderRadius: '8px',
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 600,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: '#e67e00',
                  transform: 'scale(1.02)',
                },
              }}
            >
              {showTranslation ? 'Hide Translation' : 'Show Translation'}
            </Button>

            <MuiBox sx={{ 
              display: 'flex', 
              gap: 2,
            }}>
              <Button 
                onClick={handlePrevious}
                variant="outlined"
                fullWidth
                sx={{ 
                  py: 1.5,
                  borderRadius: '8px',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  fontWeight: 600,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: '#e67e00',
                    color: '#e67e00',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                Previous
              </Button>
              
              <Button 
                onClick={handleNext}
                variant="outlined"
                fullWidth
                sx={{ 
                  py: 1.5,
                  borderRadius: '8px',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  fontWeight: 600,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: '#e67e00',
                    color: '#e67e00',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                Next
              </Button>
            </MuiBox>
          </MuiBox>

          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              textAlign: 'center',
              mt: 3,
            }}
          >
            {currentIndex + 1} of {mockVocabulary.length} words
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
} 