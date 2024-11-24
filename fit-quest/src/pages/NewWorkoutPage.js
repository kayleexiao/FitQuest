import { ActionIcon, Button, Container, Group, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { MdAdd, MdEdit } from 'react-icons/md';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import BodyweightExerciseCard from '../components/exercise/BodyweightExerciseCard';
import TimedExerciseCard from '../components/exercise/TimedExerciseCard';
import WeightExerciseCard from '../components/exercise/WeightExerciseCard';

function NewWorkoutPage() {
  const [exercises, setExercises] = useState(() => JSON.parse(localStorage.getItem('currentWorkout')) || []);
  const [workoutTitle, setWorkoutTitle] = useState('New Workout');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    const storedExercises = JSON.parse(localStorage.getItem('currentWorkout')) || [];
    setExercises(storedExercises);
  }, []);

  const handleDeleteExercise = (index) => {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
    localStorage.setItem('currentWorkout', JSON.stringify(updatedExercises));
  };

  const handleAddExercise = () => {
    window.location.href = '/add-exercise'; // Redirect to Add Exercise page
  };

  return (
    <div style={{ position: 'relative', maxWidth: '100%', margin: 'auto' }}>
      {/* Fixed Status Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1, maxWidth: '100%', margin: 'auto', backgroundColor: '#fff' }}>
        <Statusbar />
      </div>

      {/* Scrollable Content */}
      <Container style={{ paddingBottom: '90px', paddingTop: '10px', maxWidth: '100%', margin: 'auto', overflowY: 'auto' }}>
        <Navbar />

        {/* Title Section */}
        <Group position="apart" style={{ marginTop: '2rem', justifyContent: 'space-between' }}>
          {isEditingTitle ? (
            <input
              type="text"
              value={workoutTitle}
              onChange={(e) => setWorkoutTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              style={{ fontSize: '24px', fontWeight: '700', border: 'none', outline: 'none', background: 'transparent', color: '#356B77' }}
            />
          ) : (
            <Text style={{ fontSize: '3.86vh', color: '#356B77', fontWeight: 650, marginRight: '1vw'  }}>
              <i> {workoutTitle} </i>
            </Text>
          )}
          <ActionIcon variant="transparent" onClick={() => setIsEditingTitle(true)} style={{ color: '#356B77' }}>
            <MdEdit size={24} />
          </ActionIcon>
        </Group>

        {/* Exercise Cards */}
        <div style={{ marginTop: '1rem' }}>
          {exercises.length > 0 ? (
            exercises.map((exercise, index) => {
              if (exercise.type === 'weight') {
                return <WeightExerciseCard key={index} title={exercise.title} onDelete={() => handleDeleteExercise(index)} />;
              } else if (exercise.type === 'bodyweight') {
                return <BodyweightExerciseCard key={index} title={exercise.title} onDelete={() => handleDeleteExercise(index)} />;
              } else if (exercise.type === 'timed') {
                return <TimedExerciseCard key={index} title={exercise.title} onDelete={() => handleDeleteExercise(index)} />;
              }
              return null;
            })
          ) : (
            <div>
              <Text size="lg" weight={500} style={{ color: '#9E9E9E', margin: '50px' }}>
                Add your first exercise
              </Text>
            </div>
          )}
        </div>

        {/* Add Exercise Button */}
        <ActionIcon
          variant="filled"
          size="lg"
          style={{ backgroundColor: '#356B77', color: 'white', width: '30px', height: '30px', borderRadius: '50%', marginBottom: '20px' }}
          onClick={handleAddExercise}
        >
          <MdAdd size={24} />
        </ActionIcon>

        {/* Finish Workout */}
        <Group position="center" style={{ marginTop: '3rem' }}>
          <Button
            disabled={!exercises.length}
            variant="filled"
            style={{
              backgroundColor: exercises.length ? '#356B77' : '#879DA2',
              color: 'white',
              fontSize: '1.7rem',
              fontWeight: 'bold',
              borderRadius: '30px',
              width: '100%',
              height: '3rem',
              textAlign: 'center',
              letterSpacing: '0.2rem',
            }}
          >
            Finish Workout
          </Button>
        </Group>
      </Container>

      <Navbar />
    </div>
  );
}

export default NewWorkoutPage;
