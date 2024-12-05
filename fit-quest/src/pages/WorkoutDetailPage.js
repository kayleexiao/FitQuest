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

  const getPreviousWorkoutData = (exerciseTitle) => {
    const workouts = storage.history.getAll();
    const currentWorkoutDate = new Date(workout.date);
    
    // Find the most recent workout before the current one that contains this exercise
    const previousWorkout = workouts
      .filter(w => new Date(w.date) < currentWorkoutDate)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .find(w => w.exercises.some(e => e.title.toLowerCase() === exerciseTitle.toLowerCase()));

    if (previousWorkout) {
      const exercise = previousWorkout.exercises.find(e => 
        e.title.toLowerCase() === exerciseTitle.toLowerCase()
      );
      if (exercise && exercise.sets) {
        return exercise.sets;
      }
    }
    return null;
  };

  const formatSetData = (set, type) => {
    if (!set) {
      if (type === 'weight')
        return '--rep×--weight';
      else if (type === 'bodyweight')
        return '--rep'
      else if (type === 'timed')
        return '--:--:--'
    };

    switch (type) {
      case 'weight':
        return `${set.weight}kg × ${set.reps} reps`;
      case 'bodyweight':
        return `${set.reps} reps`;
      case 'timed':
        return formatTime(set.time);
      default:
        return '--';
    }
  };

  const renderSets = (exercise) => {
    console.log('Exercise with notes:', exercise);
    const previousSets = getPreviousWorkoutData(exercise.title);

    return (
      <>
        {exercise.sets?.map((set, setIndex) => (
          <div key={setIndex} style={{ marginBottom: '15px' }}>
            <Group position="apart" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '8px 12px',
              borderRadius: '8px',
              marginBottom: '5px'
            }}>
              <Text size="sm" style={{ color: 'white' }}>Set {setIndex + 1} Previous:</Text>
              <Text size="sm" style={{ color: 'white' }}>
                {previousSets && previousSets[setIndex] 
                  ? formatSetData(previousSets[setIndex], exercise.type)
                  : '-- × --'}
              </Text>
            </Group>
            <Group position="apart" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '8px 12px',
              borderRadius: '8px'
            }}>
              <Text size="sm" style={{ color: 'white' }}>Current:</Text>
              <Text size="sm" style={{ color: 'white' }}>
                {formatSetData(set, exercise.type)}
              </Text>
            </Group>
          </div>
        ))}

        {/* Notes Section */}
        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '15px' }}>
          <Text weight={500} style={{ textAlign: 'left', color: 'white', marginBottom: '5px' }}>
            Notes:
          </Text>
          <Text style={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontStyle: exercise.notes ? 'normal' : 'italic',
            textAlign: 'left'
          }}>
            {exercise.notes || 'No notes added'}
          </Text>
        </div>
      </>
    );
  };

  return (
    <div style={{ position: 'relative', maxWidth: '100%', margin: 'auto' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1, maxWidth: '100%', margin: 'auto', backgroundColor: '#fff' }}>
        <Statusbar />
      </div>

      <Container style={{ paddingBottom: '90px', paddingTop: '10px', maxWidth: '100%', margin: 'auto', overflowY: 'auto' }}>
        <Navbar />
        
        {/* Header */}
        <Group position="apart" style={{ marginTop: '2rem' }}>
          <ActionIcon 
            onClick={() => navigate(previousPage || '/history')} 
            size="lg" 
            style={{ backgroundColor: 'transparent' }}
          >
            <MdArrowBack size={34} color="#356B77" />
          </ActionIcon>
          <Text style={{ fontSize: '3.86vh', color: '#356B77', fontWeight: 650 }}>
            <i>Workout Details</i>
          </Text>
        </Group>

        {/* Workout Info */}
        <div style={{ textAlign: 'left' }}>
          <Text size="xl" weight={650} style={{ fontSize: '30px', color: '#356B77', marginBottom: '0.5rem' }}>
            <i>{workout.title}</i>
          </Text>
          <Text size="md" style={{
            color: '#666',
            marginBottom: '2rem'
          }}>
            {workoutDate} at {workout.time}
          </Text>
        </div>

        {/* Exercises */}
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
            <Text weight={500} style={{ textAlign: 'left', color: 'white', marginBottom: '15px', fontSize: '18px' }}>
              {exercise.title}
            </Text>
            {renderSets(exercise)}
          </Card>
        ))}
      </Container>
      
      <Navbar />
    </div>
  );
}

export default WorkoutDetailPage;