import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Text, Box, Button } from '@mantine/core';

function WorkoutDetailPage() {
  const { workoutId } = useParams();

  const exercises = {
    'push': [
      'Push Ups',
      'Bench Press',
      'Shoulder Press',
      'Tricep Extensions',
      'Dips',
      'Incline Bench Press',
      'Lateral Raises',
      'Diamond Push Ups'
    ],
    'abs': [
      'Leg Raises',
      'Crunches',
      'Sit Ups',
      'Russian Twist',
      'Planks',
      'Mountain Climbers',
      'Flutter Kicks',
      'V-Ups'
    ],
    'legs': [
      'Squats',
      'Lunges',
      'Deadlifts',
      'Calf Raises',
      'Leg Press',
      'Romanian Deadlifts',
      'Hip Thrusts',
      'Jump Squats'
    ],
    'pull': [
      'Pull Ups',
      'Chin Ups',
      'Barbell Rows',
      'Lat Pulldowns',
      'Face Pulls',
      'Bicep Curls',
      'Hammer Curls',
      'Back Extensions'
    ],
    'cardio': [
      'Running',
      'Jumping Jacks',
      'Burpees',
      'Jump Rope',
      'High Knees',
      'Mountain Climbers',
      'Cycling',
      'Swimming'
    ]
  };

  return (
    <Box style={{ 
      height: '100vh',
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      <Container 
        size="100%"
        style={{ 
          backgroundColor: '#ffffff', 
          padding: '16px 4px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
        <Box style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px',
        }}>
          <Box style={{ 
            marginBottom: '20px',
            position: 'relative'
          }}>
            <Box style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginTop: '20px'
            }}>
              <Text
                style={{
                  color: '#356B77',
                  fontSize: '28px',
                  fontFamily: 'ABeeZee, sans-serif',
                  textAlign: 'left',
                }}
              >
                {workoutId.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Text>
              
              <img 
                src="/Bookmark.png"
                alt="bookmark"
                style={{ 
                  cursor: 'pointer',
                  width: '24px',
                  height: '24px',
                  marginTop: '8px'
                }}
              />
            </Box>
            
            <Text
              style={{
                color: '#879DA1',
                fontSize: '16px',
                fontFamily: 'ABeeZee, sans-serif',
                marginTop: '8px',
              }}
            >
              Difficulty: ★★☆
            </Text>
          </Box>

          {exercises[workoutId]?.map((exercise, index) => (
            <Button
              key={index}
              variant="light"
              fullWidth
              style={{
                backgroundColor: '#879DA1',
                color: 'white',
                marginBottom: '16px',
                height: '70px',
                borderRadius: '35px',
                justifyContent: 'space-between',
                padding: '0 30px',
                fontSize: '16px',
              }}
            >
              <Text>{exercise}</Text>
              <Text style={{ 
                fontSize: '24px',
                color: 'white',
                opacity: 0.8 
              }}>›</Text>
            </Button>
          ))}

          <Button
            fullWidth
            style={{
              backgroundColor: '#5FB7CD',
              color: 'white',
              marginTop: '30px',
              height: '70px',
              borderRadius: '35px',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            FINISH WORKOUT
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default WorkoutDetailPage; 