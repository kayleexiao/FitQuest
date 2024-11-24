import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Text, TextInput, Button, Group, ActionIcon } from '@mantine/core';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import { MdArrowBack } from 'react-icons/md';

function CreateExercisePage() {
  const navigate = useNavigate();
  const [exerciseTitle, setExerciseTitle] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const handleAddExercise = () => {
    const newExercise = { title: exerciseTitle.trim() || 'Untitled', type: selectedType };

    const currentWorkout = JSON.parse(localStorage.getItem('currentWorkout')) || [];
    localStorage.setItem('currentWorkout', JSON.stringify([...currentWorkout, newExercise]));

    const recentExercises = JSON.parse(localStorage.getItem('recentExercises')) || [];
    const isDuplicate = recentExercises.some(
      (exercise) => exercise.title === newExercise.title && exercise.type === newExercise.type
    );
    if (!isDuplicate) {
      localStorage.setItem('recentExercises', JSON.stringify([...recentExercises, newExercise]));
    }

    navigate('/new-workout');
  };

  return (
    <div style={{ position: 'relative', maxWidth: '100%', margin: 'auto' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1, maxWidth: '100%', margin: 'auto', backgroundColor: '#fff' }}>
        <Statusbar />
      </div>

      <Container style={{ paddingBottom: '90px', paddingTop: '10px', maxWidth: '100%', margin: 'auto', overflowY: 'auto' }}>
        <Navbar />
        <Group position="apart" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <ActionIcon onClick={() => navigate('/add-exercise')} size="lg" style={{ backgroundColor: 'transparent' }}>
            <MdArrowBack size={34} color="#356B77" />
          </ActionIcon>
          <Text size="xl" weight={600} style={{ fontSize: '28px', color: '#356B77', textAlign: 'center' }}>
            Create New Exercise
          </Text>
        </Group>

        <TextInput
          placeholder="Enter Exercise Name"
          value={exerciseTitle}
          onChange={(e) => setExerciseTitle(e.target.value)}
          variant="unstyled"
          style={{ marginBottom: '2rem', backgroundColor: '#dddddd', borderRadius: '30px', paddingLeft: '1rem' }}
        />

        <Text size="xl" weight={500} style={{ textAlign: 'left', marginBottom: '1rem', color: '#356B77' }}>
          Choose your exercise type
        </Text>
        <Group direction="column" spacing="md">
          <Button
            fullWidth
            onClick={() => setSelectedType('weight')}
            style={{
              backgroundColor: selectedType === 'weight' ? '#356B77' : '#879DA2',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '30px',
              height: '7rem',
              fontSize: '30px',
              lineHeight: '2.5rem',
            }}
          >
            Weight-Based <br /> Exercise
          </Button>
          <Button
            fullWidth
            onClick={() => setSelectedType('bodyweight')}
            style={{
              backgroundColor: selectedType === 'bodyweight' ? '#356B77' : '#879DA2',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '30px',
              height: '7rem',
              fontSize: '30px',
              lineHeight: '2.5rem',
            }}
          >
            Bodyweight <br /> Exercise
          </Button>
          <Button
            fullWidth
            onClick={() => setSelectedType('timed')}
            style={{
              backgroundColor: selectedType === 'timed' ? '#356B77' : '#879DA2',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '30px',
              height: '7rem',
              fontSize: '30px',
              lineHeight: '2.5rem',
            }}
          >
            Timed <br /> Exercise
          </Button>
        </Group>

        <Button
          fullWidth
          onClick={handleAddExercise}
          disabled={!selectedType}
          style={{
            marginTop: '2rem',
            backgroundColor: selectedType ? '#356B77' : '#ddd',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '25px',
            borderRadius: '30px',
            height: '50px',
          }}
        >
          Add to Workout
        </Button>
      </Container>
      <Navbar />
    </div>
  );
}

export default CreateExercisePage;
