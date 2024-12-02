import { ActionIcon, Button, Container, Group, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import WeightExerciseCard from '../components/exercise/WeightExerciseCard';
import BodyweightExerciseCard from '../components/exercise/BodyweightExerciseCard';
import TimedExerciseCard from '../components/exercise/TimedExerciseCard';
import storage from '../utils/storage';

function WorkoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const workout = location.state?.workout;

  const [bookmarked, setBookmarked] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [difficulty, setDifficulty] = useState(2); // 1-3 scale

  // Check if this workout is saved and load workout data
  useEffect(() => {
    if (!workout) {
      navigate('/explore');
      return;
    }

    // Check if this workout is saved in templates
    const savedTemplates = storage.templates.getAll();
    const isSaved = savedTemplates.some(template => template.title === workout.title);
    setBookmarked(isSaved);

    // Set workout data
    setWorkoutTitle(workout.title);
    setDifficulty(workout.difficulty || 2);

    // Determine exercise type based on category
    const getExerciseType = (category) => {
      switch (category) {
        case 'Weight Lifting':
          return 'weight';
        case 'Bodyweight':
          return 'bodyweight';
        case 'Timed':
          return 'timed';
        default:
          return 'weight';
      }
    };

    // Convert workout exercises to proper format if coming from explore page
    const formattedExercises = workout.exercises.map(exercise => {
      if (typeof exercise === 'string') {
        return {
          id: Date.now() + Math.random(),
          title: exercise,
          type: getExerciseType(workout.category),
          sets: []
        };
      }
      return exercise;
    });

    setExercises(formattedExercises);
  }, [workout, navigate]);

  const handleBookmark = () => {
    if (bookmarked) {
      // Remove from templates
      const currentTemplates = storage.templates.getAll();
      const updatedTemplates = currentTemplates.filter(template => 
        template.title !== workout.title
      );
      storage.templates.save(updatedTemplates);
    } else {
      // Add to templates
      const templateWorkout = {
        title: workout.title,
        exercises: workout.exercises,
        difficulty: workout.difficulty || 2,
        category: workout.category,
        createdAt: new Date().toISOString(),
        lastUsed: null
      };
      storage.templates.add(templateWorkout);
    }
    setBookmarked(!bookmarked);
  };

  const handleStartWorkout = () => {
    // Save current exercises to currentWorkout in storage
    storage.currentWorkout.save(exercises);
    // Navigate to new workout page with these exercises
    navigate('/new-workout', { 
      state: { 
        workoutTemplate: {
          title: workoutTitle,
          exercises: exercises,
          category: workout.category
        }
      }
    });
  };

  const renderDifficultyStars = () => {
    return '★'.repeat(difficulty) + '☆'.repeat(3 - difficulty);
  };

  const deleteExercise = (id) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  const renderExerciseCard = (exercise) => {
    const commonProps = {
      key: exercise.id || `${exercise.title}-${Math.random()}`,
      id: exercise.id,
      title: exercise.title,
      sets: exercise.sets,
      onDelete: () => deleteExercise(exercise.id)
    };

    switch (exercise.type) {
      case 'weight':
        return <WeightExerciseCard {...commonProps} />;
      case 'bodyweight':
        return <BodyweightExerciseCard {...commonProps} />;
      case 'timed':
        return <TimedExerciseCard {...commonProps} />;
      default:
        return <WeightExerciseCard {...commonProps} />;
    }
  };

  return (
    <div style={{ position: 'relative', maxWidth: '100%', margin: 'auto' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1, maxWidth: '100%', margin: 'auto', backgroundColor: '#fff' }}>
        <Statusbar />
      </div>

      <Container style={{ paddingBottom: '90px', paddingTop: '10px', maxWidth: '100%', margin: 'auto', overflowY: 'auto' }}>
        <Navbar />

        {/* Title and Bookmark */}
        <Group position="apart" style={{ marginTop: '3rem', justifyContent: 'space-between' }}>
          <Text size="2xl" weight={700} style={{ fontSize: '30px', color: '#356B77' }}>
            <i>{workoutTitle}</i>
          </Text>
          <ActionIcon variant="transparent" onClick={handleBookmark}>
            {bookmarked ? <MdBookmark size={45} color="#356B77" /> : <MdBookmarkBorder size={45} color="#356B77" />}
          </ActionIcon>
        </Group>

        {/* Difficulty Level */}
        <Text color="dimmed" size="l" style={{ textAlign: "left", marginBottom: '1rem', color: '#356B77' }}>
          Difficulty: {renderDifficultyStars()}
        </Text>

        {/* Exercise Cards */}
        {exercises.map((exercise) => renderExerciseCard(exercise))}

        {/* Start Workout Button */}
        <Button
          fullWidth
          variant="filled"
          onClick={handleStartWorkout}
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
          START WORKOUT
        </Button>
      </Container>

      <Navbar />
    </div>
  );
}

export default WorkoutPage;