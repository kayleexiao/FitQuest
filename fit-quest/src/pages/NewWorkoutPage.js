import { ActionIcon, Button, Container, Group, Text, Modal } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { MdAddCircleOutline, MdEdit } from 'react-icons/md';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import BodyweightExerciseCard from '../components/exercise/BodyweightExerciseCard';
import TimedExerciseCard from '../components/exercise/TimedExerciseCard';
import WeightExerciseCard from '../components/exercise/WeightExerciseCard';
import { useLocation, useNavigate } from 'react-router-dom';

function NewWorkoutPage() {
  const location = useLocation();
  const workoutTemplate = location.state?.workoutTemplate;
  const navigate = useNavigate();

  const [exercises, setExercises] = useState(() => JSON.parse(localStorage.getItem('currentWorkout')) || []);
  const [workoutTitle, setWorkoutTitle] = useState('New Workout');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  useEffect(() => {
    if (workoutTemplate) {
      setWorkoutTitle(workoutTemplate.title);
      setExercises(workoutTemplate.exercises);
      localStorage.setItem('currentWorkout', JSON.stringify(workoutTemplate.exercises));
    }
  }, [workoutTemplate]);

  const handleFinishWorkout = () => {
    setIsSummaryModalOpen(true);
  };

  const handleCompleteWorkout = () => {
    try {
      // Get current date and time
      const completionDate = new Date().toISOString();
      
      // Create workout history entry with null checks
      const workoutHistory = {
        title: workoutTitle || 'Workout',
        date: completionDate,
        exercises: exercises?.map(exercise => ({
          title: exercise?.title || 'Exercise',
          sets: Array.isArray(exercise?.sets) ? exercise.sets.map(set => ({
            reps: set?.reps || 0,
            weight: set?.weight || 0
          })) : []
        })) || []
      };

      // Safely get existing history
      let existingHistory = [];
      try {
        existingHistory = JSON.parse(localStorage.getItem('workoutHistory')) || [];
      } catch (e) {
        console.error('Error parsing workout history:', e);
      }
      
      // Add new workout to history
      const updatedHistory = [workoutHistory, ...existingHistory];
      localStorage.setItem('workoutHistory', JSON.stringify(updatedHistory));

      // Clear current workout
      localStorage.removeItem('currentWorkout');
      setExercises([]);
      setWorkoutTitle('');
      setIsSummaryModalOpen(false);
      
      // Navigate to history page
      navigate('/history');
    } catch (error) {
      console.error('Error completing workout:', error);
      // Optionally show error to user
      alert('There was an error saving your workout. Please try again.');
    }
  };

  const handleRepsChange = (exerciseIndex, setIndex, newReps) => {
    const updatedExercises = [...exercises];
    if (!updatedExercises[exerciseIndex].sets) {
      updatedExercises[exerciseIndex].sets = [];
    }
    if (!updatedExercises[exerciseIndex].sets[setIndex]) {
      updatedExercises[exerciseIndex].sets[setIndex] = {};
    }
    updatedExercises[exerciseIndex].sets[setIndex] = {
      ...updatedExercises[exerciseIndex].sets[setIndex],
      reps: newReps
    };
    setExercises(updatedExercises);
    localStorage.setItem('currentWorkout', JSON.stringify(updatedExercises));
  };

  const handleWeightChange = (exerciseIndex, setIndex, newWeight) => {
    const updatedExercises = [...exercises];
    if (!updatedExercises[exerciseIndex].sets) {
      updatedExercises[exerciseIndex].sets = [];
    }
    if (!updatedExercises[exerciseIndex].sets[setIndex]) {
      updatedExercises[exerciseIndex].sets[setIndex] = {};
    }
    updatedExercises[exerciseIndex].sets[setIndex] = {
      ...updatedExercises[exerciseIndex].sets[setIndex],
      weight: newWeight
    };
    setExercises(updatedExercises);
    localStorage.setItem('currentWorkout', JSON.stringify(updatedExercises));
  };

  const handleAddSet = (exerciseIndex) => {
    const updatedExercises = [...exercises];
    if (!updatedExercises[exerciseIndex].sets) {
      updatedExercises[exerciseIndex].sets = [];
    }
    updatedExercises[exerciseIndex].sets.push({ reps: '', weight: '' });
    setExercises(updatedExercises);
    localStorage.setItem('currentWorkout', JSON.stringify(updatedExercises));
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
    setExercises(updatedExercises);
    localStorage.setItem('currentWorkout', JSON.stringify(updatedExercises));
  };

  const handleDeleteExercise = (index) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(index, 1);
    setExercises(updatedExercises);
    localStorage.setItem('currentWorkout', JSON.stringify(updatedExercises));
  };

  const handleAddExercise = () => {
    navigate('/exercise-selection', {
      state: {
        returnPath: '/new-workout',
        currentExercises: exercises
      }
    });
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
                return <WeightExerciseCard
                  key={index}
                  title={exercise.title}
                  sets={exercise.sets || []}
                  onRepsChange={(setIndex, newReps) => handleRepsChange(index, setIndex, newReps)}
                  onWeightChange={(setIndex, newWeight) => handleWeightChange(index, setIndex, newWeight)}
                  onAddSet={() => handleAddSet(index)}
                  onRemoveSet={(setIndex) => handleRemoveSet(index, setIndex)}
                  onDelete={() => handleDeleteExercise(index)}
                />;
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
            onClick={handleFinishWorkout}
          >
            Finish Workout
          </Button>
        </Group>

        <Modal
          opened={isSummaryModalOpen}
          onClose={() => setIsSummaryModalOpen(false)}
          title="Workout Summary"
          size="lg"
          styles={{
            title: {
              color: '#356B77',
              fontWeight: 600,
              fontSize: '24px'
            },
            modal: {
              padding: '20px'
            }
          }}
        >
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ 
                color: '#356B77', 
                margin: 0,
                fontSize: '28px'
              }}>
                {workoutTitle || 'Workout'} Complete!
              </h2>
              <span style={{ color: '#666' }}>
                {new Date().toLocaleDateString()}
              </span>
            </div>

            <div style={{ marginBottom: '30px' }}>
              {exercises.map((exercise, index) => (
                <div 
                  key={index}
                  style={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: '10px',
                    padding: '20px',
                    marginBottom: '15px'
                  }}
                >
                  <h3 style={{ 
                    margin: '0 0 15px 0',
                    color: '#356B77',
                    fontSize: '20px'
                  }}>
                    {exercise.title}
                  </h3>
                  
                  <div style={{ 
                    display: 'grid',
                    gap: '10px'
                  }}>
                    {exercise.sets && exercise.sets.map((set, setIndex) => (
                      <div 
                        key={setIndex}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: 'white',
                          padding: '12px 15px',
                          borderRadius: '8px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>Set {setIndex + 1}</span>
                        <span style={{ color: '#666' }}>
                          {set.weight} × {set.reps}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '15px'
            }}>
              <button
                onClick={() => setIsSummaryModalOpen(false)}
                style={{
                  padding: '12px 25px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Continue Editing
              </button>
              <button
                onClick={handleCompleteWorkout}
                style={{
                  padding: '12px 25px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#356B77',
                  color: 'white',
                  cursor: 'pointer',
                  flex: 1,
                  fontWeight: 500
                }}
              >
                Complete & Save
              </button>
            </div>
          </div>
        </Modal>
      </Container>

      <Navbar />
    </div>
  );
}

export default NewWorkoutPage;
