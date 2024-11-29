import { ActionIcon, Button, Card, Container, Group, Text, TextInput } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { MdAdd, MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import { workoutService } from '../services/workoutService';
import axios from '../api/axios'; 

function AddExercisePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [recentExercises, setRecentExercises] = useState([]);
  const [exerciseTitle, setExerciseTitle] = useState(''); // Initialize exerciseTitle
  const [exerciseType, setExerciseType] = useState(''); // Initialize exerciseType

  // Load recent exercises from API
  useEffect(() => {
    const loadRecentExercises = async () => {
      try {
        const exercises = await workoutService.getRecentExercises();
        setRecentExercises(exercises);
      } catch (error) {
        console.error('Error loading recent exercises:', error);
      }
    };

    loadRecentExercises();
  }, []);

  const handleAddRecentExercise = async (exercise) => {
    try {
      
    const newExercise = {
      title: exerciseTitle.trim() || 'Untitled', // ensures title is trimmed and defaults to 'Untitled'
      type: exerciseType,
    };

    // 1. Add the new exercise to the current workout via API
    const currentWorkoutResponse = await axios.post('/api/currentWorkouts', newExercise);
    if (!currentWorkoutResponse.data) {
      alert('Failed to add the exercise to the current workout. Please try again.');
      return;
    }

    // 2. Add the exercise to recent exercises if it's not a duplicate
    const recentExercisesResponse = await axios.get('/api/exercises/recent'); // Fetch recent exercises
    const recentExercises = recentExercisesResponse.data || [];
    const isDuplicate = recentExercises.some(
      (exercise) => exercise.title === newExercise.title && exercise.type === newExercise.type
    );

    if (!isDuplicate) {
      await axios.post('/api/exercises/recent', newExercise); // Add to recent exercises
    }

    // 3. Navigate to the "New Workout" page
    navigate('/new-workout');
  } catch (error) {
    console.error('Error creating exercise:', error);
    alert('An error occurred while creating the exercise.');
  }
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
