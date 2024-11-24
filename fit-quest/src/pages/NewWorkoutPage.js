import { ActionIcon, Button, Container, Group, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { MdAddCircleOutline, MdEdit } from 'react-icons/md';
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
<Group position="apart" style={{ marginTop: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
      {isEditingTitle ? (
        <input
          type="text"
          value={workoutTitle}
          onChange={(e) => setWorkoutTitle(e.target.value)}
          onBlur={() => setIsEditingTitle(false)} // Exit edit mode on blur
          style={{ fontSize: '3.86vh', fontWeight: 650, border: 'none', outline: 'none', background: 'transparent', color: '#356B77', width: '100%' }}
        />
      ) : (
        <Text style={{ fontSize: '3.86vh', color: '#356B77', fontWeight: 650 }}>
          <i>{workoutTitle}</i>
        </Text>
      )}
    </div>
    <ActionIcon
      variant="transparent"
      onClick={() => setIsEditingTitle((prev) => !prev)} // Toggle edit mode
      style={{ color: isEditingTitle ? '#1e90ff' : '#356B77', marginLeft: '8px' }}
    >
      <MdEdit size={24} />
    </ActionIcon>
  </div>
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
          size='xl'
          variant="transparent"
          style={{ color: '#356B77', marginBottom: '1rem' }}
          onClick={handleAddExercise}
        >
          <MdAddCircleOutline size={50} />
        </ActionIcon>

        {/* Finish Workout */}
        <Group position="center" style={{ marginTop: '2rem' }}>
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
