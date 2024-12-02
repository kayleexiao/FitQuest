import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Text, Group, Card, ActionIcon } from '@mantine/core';
import { MdArrowBack } from 'react-icons/md';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';

function WorkoutDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { workout, previousPage } = location.state || {};

  if (!workout) {
    navigate('/history');
    return null;
  }

  const workoutDate = new Date(workout.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  console.log('Workout:', workout);

  return (
    <div style={{ position: 'relative', maxWidth: '100%', margin: 'auto' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1, maxWidth: '100%', margin: 'auto', backgroundColor: '#fff' }}>
        <Statusbar />
      </div>

      <Container style={{ paddingBottom: '90px', paddingTop: '10px', maxWidth: '100%', margin: 'auto', overflowY: 'auto' }}>
        <Navbar />
        
        {/* Header */}
        <Group position="apart" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          <ActionIcon 
            onClick={() => navigate(previousPage || '/history')} 
            size="lg" 
            style={{ backgroundColor: 'transparent' }}
          >
            <MdArrowBack size={34} color="#356B77" />
          </ActionIcon>
          <Text size="xl" weight={650} style={{ fontSize: '28px', color: '#356B77' }}>
            <i>Workout Details</i>
          </Text>
        </Group>

        {/* Workout Info */}
        <div style={{ marginBottom: '2rem' }}>
          <Text size="xl" weight={700} style={{ color: '#356B77', marginBottom: '0.5rem' }}>
            {workout.title}
          </Text>
          <Text size="sm" style={{ color: '#666' }}>
            {workoutDate} at {workout.time}
          </Text>
        </div>

        {/* Exercises */}
        <Text size="lg" weight={500} style={{ color: '#356B77', marginBottom: '1rem' }}>
          Exercises
        </Text>
        {workout.exercises?.map((exercise, index) => (
          <Card
            key={index}
            style={{
              backgroundColor: '#879DA1',
              marginBottom: '1rem',
              padding: '15px',
              borderRadius: '15px',
            }}
          >
            <Text weight={500} style={{ color: 'white', marginBottom: '10px' }}>
              {exercise.title}
            </Text>
            {exercise.sets?.map((set, setIndex) => (
              <Group key={setIndex} position="apart" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '8px 12px',
                borderRadius: '8px',
                marginBottom: '5px'
              }}>
                <Text size="sm" style={{ color: 'white' }}>Set {setIndex + 1}</Text>
                <Text size="sm" style={{ color: 'white' }}>
                  {exercise.type === 'weight'
                    ? `${set.weight}kg × ${set.reps} reps`
                    : exercise.type === 'bodyweight'
                    ? `${set.reps} reps`
                    : `${formatTime(set.time)} seconds`}
                </Text>
              </Group>
            ))}
          </Card>
        ))}
      </Container>
      
      <Navbar />
    </div>
  );
}

export default WorkoutDetailPage;