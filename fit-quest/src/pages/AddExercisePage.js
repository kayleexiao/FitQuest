import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Text, Button, TextInput, Group, Card, ActionIcon } from '@mantine/core';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import { MdArrowBack, MdAdd } from 'react-icons/md';

function AddExercisePage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [recentExercises] = useState(() => {
    const saved = localStorage.getItem('recentExercises');
    return saved ? JSON.parse(saved) : [];
  });

  const handleAddRecentExercise = (exercise) => {
    const currentWorkout = JSON.parse(localStorage.getItem('currentWorkout')) || [];
    localStorage.setItem('currentWorkout', JSON.stringify([...currentWorkout, exercise]));
    navigate('/new-workout');
  };

  const handleCreateNewExercise = () => navigate('/create-exercise');

  const filteredExercises = recentExercises.filter((exercise) =>
    exercise.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', maxWidth: '100%', margin: 'auto' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1, maxWidth: '100%', margin: 'auto', backgroundColor: '#fff' }}>
        <Statusbar />
      </div>

      <Container style={{ paddingBottom: '90px', paddingTop: '10px', maxWidth: '100%', margin: 'auto', overflowY: 'auto' }}>
        <Navbar />
        <Group position="apart" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          <ActionIcon onClick={() => navigate('/new-workout')} size="lg" style={{ backgroundColor: 'transparent' }}>
            <MdArrowBack size={34} color="#356B77" />
          </ActionIcon>
          <Text size="xl" weight={650} style={{ fontSize: '28px', color: '#356B77' }}>
            <i>Add Exercise</i>
          </Text>
        </Group>

        <Button
          fullWidth
          style={{ marginBottom: '2rem', backgroundColor: '#356B77', color: 'white', fontSize: '18px', borderRadius: '10px' }}
          onClick={handleCreateNewExercise}
        >
          Create New Exercise
        </Button>

        <TextInput
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="unstyled"
          style={{ marginBottom: '2rem', backgroundColor: '#dddddd', borderRadius: '30px', paddingLeft: '1rem' }}
        />

        <Text size="lg" weight={500} style={{ textAlign: 'left', marginBottom: '1rem', color: '#356B77' }}>
          Recent Exercises
        </Text>
        <Group direction="column" spacing="sm">
          {filteredExercises.map((exercise, index) => (
            <Card
              key={index}
              radius="xl"
              style={{
                backgroundColor: '#879DA2',
                color: 'white',
                width: '100%',
                padding: '3px 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                borderRadius: '5rem',
              }}
              onClick={() => handleAddRecentExercise(exercise)}
            >
              <Group position="apart" style={{ padding: '0.3rem' }}>
                <MdAdd size={20} style={{ color: 'white' }} />
                <Text weight={500} size="lg" style={{ fontSize: '16px', fontWeight: '500' }}>
                  {exercise.title}
                </Text>
              </Group>
            </Card>
          ))}
        </Group>
      </Container>
      <Navbar />
    </div>
  );
}

export default AddExercisePage;
