// pages/WorkoutPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Text, Group, ActionIcon, Button } from '@mantine/core';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import WeightExerciseCard from '../components/exercise/WeightExerciseCard';
import BodyweightExerciseCard from '../components/exercise/BodyweightExerciseCard';
import CardioExerciseCard from '../components/exercise/CardioExerciseCard';
import { MdBookmark, MdBookmarkBorder, MdStar, MdStarBorder } from 'react-icons/md';

function WorkoutPage() {
  const [bookmarked, setBookmarked] = useState(false);

  // State to manage the list of exercises
  const [exercises, setExercises] = useState([
    { id: 1, type: 'weight', title: 'Weight Exercise' },
    { id: 2, type: 'bodyweight', title: 'Bodyweight Exercise' },
    { id: 3, type: 'cardio', title: 'Cardio Exercise' },
  ]);

  // Function to delete an exercise by ID
  const deleteExercise = (id) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  return (
    <div style={{ position: 'relative', maxWidth: '430px', margin: 'auto' }}>
      {/* Fixed Status Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1, maxWidth: '430px', margin: 'auto', backgroundColor: '#fff' }}>
        <Statusbar />
      </div>

      {/* Scrollable Content Container */}
      <Container style={{ paddingBottom: '90px', maxWidth: '430px', margin: 'auto', overflowY: 'auto' }}>
        {/* Navbar */}
        <Navbar />

        {/* Title and Bookmark */}
        <Group position="apart" style={{ marginTop: '3rem', justifyContent: 'space-between' }}>
          <Text size="2xl" weight={700} style={{ fontSize: '45px' }}>TITLE</Text>
          <ActionIcon variant="transparent" onClick={() => setBookmarked(!bookmarked)}>
            {bookmarked ? <MdBookmark size={45} color="#356B77" /> : <MdBookmarkBorder size={45} color="#356B77" />}
          </ActionIcon>
        </Group>

        {/* Left-aligned Difficulty Level */}
        <Text color="dimmed" size="l" style={{ textAlign: "left", marginBottom: '1rem' }}>
          Difficulty: <MdStar color="#356B77" /> <MdStar color="#356B77" /> <MdStarBorder color="#356B77" />
        </Text>

        {/* Render Exercise Cards Dynamically */}
        {exercises.map((exercise) => {
          if (exercise.type === 'weight') {
            return (
              <WeightExerciseCard
                key={exercise.id}
                title={exercise.title}
                onDelete={() => deleteExercise(exercise.id)}
              />
            );
          } else if (exercise.type === 'bodyweight') {
            return (
              <BodyweightExerciseCard
                key={exercise.id}
                title={exercise.title}
                onDelete={() => deleteExercise(exercise.id)}
              />
            );
          } else if (exercise.type === 'cardio') {
            return (
              <CardioExerciseCard
                key={exercise.id}
                title={exercise.title}
                onDelete={() => deleteExercise(exercise.id)}
              />
            );
          }
          return null;
        })}

        {/* Finish Workout Button Styled to Match the Design */}
        <Link to="/saved" style={{ flex: 1, textAlign: 'center', textDecoration: 'none'}}>
          <Button
            fullWidth
            variant="filled"
            style={{
              marginTop: '1rem',
              height: '3rem',
              backgroundColor: '#879DA2',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              borderRadius: '20px',
              padding: '10px 0',
            }}
          >
            FINISH WORKOUT
          </Button>
        </Link>
      </Container>

      {/* Navbar */}
      <Navbar />
    </div>
  );
}

export default WorkoutPage;
