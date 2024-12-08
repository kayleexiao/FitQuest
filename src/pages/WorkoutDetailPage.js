import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Text, Group, Card, ActionIcon } from '@mantine/core';
import { MdArrowBack } from 'react-icons/md';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import storage from '../utils/storage';

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

  const getPersonalRecord = (exerciseTitle, type) => {
    return storage.personalRecords.get(exerciseTitle, type);
  };

  const renderPersonalRecord = (exercise) => {
    if (exercise.type === 'timed') return null;
    
    const record = getPersonalRecord(exercise.title, exercise.type);
    if (!record) return null;

    if (exercise.type === 'weight') {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '8px 12px',
          borderRadius: '8px',
          marginBottom: '10px',
          fontSize: '0.9em'
        }}>
          <Text color="white">
            Personal Record: {record.weight}kg × {record.reps} reps
            <br />
            <span style={{ fontSize: '0.8em' }}>
              {new Date(record.date).toLocaleDateString()}
            </span>
          </Text>
        </div>
      );
    } else if (exercise.type === 'bodyweight') {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '8px 12px',
          borderRadius: '8px',
          marginBottom: '10px',
          fontSize: '0.9em'
        }}>
          <Text color="white">
            Personal Record: {record.reps} reps
            <br />
            <span style={{ fontSize: '0.8em' }}>
              {new Date(record.date).toLocaleDateString()}
            </span>
          </Text>
        </div>
      );
    }
  };

  return (
    <div style={{ position: 'relative', maxWidth: '100%', margin: 'auto' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1, maxWidth: '100%', margin: 'auto', backgroundColor: '#fff' }}>
        <Statusbar />
      </div>

      <Container style={{ paddingBottom: '90px', paddingTop: '10px', maxWidth: '100%', margin: 'auto', overflowY: 'auto' }}>
        <Navbar />
        
        {/* Header */}
        <Group position="apart" style={{ marginTop: '2rem'}}>
          <ActionIcon 
            onClick={() => navigate(previousPage || '/history')} 
            size="lg" 
            style={{ backgroundColor: 'transparent' }}
          >
            <MdArrowBack size={34} color="#356B77" />
          </ActionIcon>
          <Text style={{ fontSize: '3.86vh', color: '#356B77', fontWeight: 650  }}>
            <i>Workout Details</i>
          </Text>
        </Group>

        {/* Workout Info */}
        <div style={{ textAlign: 'left' }}>
          <Text size="xl" weight={650} style={{ fontSize: '30px', color: '#356B77', marginBottom: '0.5rem'}}>
            <i>{workout.title}</i>
          </Text>
          <Text size="md" style={{
            color: '#666',
            marginBottom: '2rem'
          }}>
            {workoutDate} at {workout.time}
          </Text>
        </div>

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
            
            {/* Personal Record Display (if you have it) */}
            {renderPersonalRecord && renderPersonalRecord(exercise)}

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
            <Text weight={500} style={{ color: 'white', marginBottom: '10px', marginTop: '15px' }}>
              {'Notes'}
            </Text>
            <Text style={{
              color: exercise.notes ? 'white' : 'rgba(255, 255, 255, 0.7)',
              marginBottom: '10px',
              fontStyle: exercise.notes ? 'normal' : 'italic'
            }}>
              {exercise.notes || 'No notes added'}
            </Text>
          </Card>
        ))}
      </Container>
      
      <Navbar />
    </div>
  );
}

export default WorkoutDetailPage;