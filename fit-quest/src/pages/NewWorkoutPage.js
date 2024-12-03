import { ActionIcon, Button, Container, Group, Text, Modal } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { MdAddCircleOutline, MdEdit } from 'react-icons/md';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import BodyweightExerciseCard from '../components/exercise/BodyweightExerciseCard';
import TimedExerciseCard from '../components/exercise/TimedExerciseCard';
import WeightExerciseCard from '../components/exercise/WeightExerciseCard';
import { useLocation, useNavigate } from 'react-router-dom';
import storage from '../utils/storage';

const NewWorkoutPage = ({ setIsWorkoutInProgress }) => {
  const location = useLocation();
  const workoutTemplate = location.state?.workoutTemplate;
  const navigate = useNavigate();

  const [exercises, setExercises] = useState(() => {
    const savedExercises = storage.currentWorkout.get();
    return savedExercises || [];
  });
  const [workoutTitle, setWorkoutTitle] = useState('New Workout');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  useEffect(() => {
    if (workoutTemplate) {
      setWorkoutTitle(workoutTemplate.title);
      // Ensure each exercise has an id
      const exercisesWithIds = workoutTemplate.exercises.map(exercise => ({
        ...exercise,
        id: exercise.id || Date.now() + Math.random()
      }));
      setExercises(exercisesWithIds);
      storage.currentWorkout.save(exercisesWithIds);
    } else {
      const returnedExercises = location.state?.exercises;
      if (returnedExercises) {
        // Ensure each exercise has an id
        const exercisesWithIds = returnedExercises.map(exercise => ({
          ...exercise,
          id: exercise.id || Date.now() + Math.random()
        }));
        setExercises(exercisesWithIds);
        storage.currentWorkout.save(exercisesWithIds);
      }
    }
  }, [workoutTemplate, location.state]);

  const handleFinishWorkout = () => {
    setIsWorkoutInProgress(false);
    setIsSummaryModalOpen(true);
  };

  const handleStartWorkout = () => {
    setIsWorkoutInProgress(true);
  };

  // Call handleStartWorkout when the workout starts
  useEffect(() => {
    handleStartWorkout();
    return () => {
      setIsWorkoutInProgress(false); // Cleanup on unmount
    };
  }, []);

  const handleCompleteWorkout = () => {
    try {
      const completionDate = new Date().toISOString();
      const formattedDate = new Date().toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
      });
      
      // Get the latest sets data from localStorage for each exercise
      const updatedExercises = exercises.map(exercise => {
        const savedSets = localStorage.getItem(`exercise-${exercise.id}-sets`);
        return {
          ...exercise,
          sets: savedSets ? JSON.parse(savedSets) : exercise.sets
        };
      });
      
      // Format workout data for history with the updated sets
      const workoutHistory = {
        title: workoutTitle || 'Workout',
        date: completionDate,
        exercises: updatedExercises.map(exercise => ({
          title: exercise?.title || 'Exercise',
          type: exercise?.type,
          sets: Array.isArray(exercise?.sets) ? exercise.sets.map(set => ({
            reps: set?.reps || 0,
            weight: set?.weight || 0,
            time: set?.time || 0,
            timestamp: set?.timestamp || 0
          })) : []
        }))
      };

      // Save to history
      storage.history.add(workoutHistory);

      // Handle template saving/updating
      if (workoutTemplate) {
        // This is a workout started from saved page - update the template's last done date
        const savedTemplates = storage.templates.getAll();
        const updatedTemplates = savedTemplates.map(template => {
          if (template.title === workoutTemplate.title) {
            return {
              ...template,
              lastDoneDate: formattedDate,
              exercises: exercises.map(exercise => ({
                title: exercise.title,
                type: exercise.type  // Preserve the exercise type when updating template
              }))
            };
          }
          return template;
        });
        storage.templates.save(updatedTemplates);
      } else {
        // This is a new workout - save it as a template
        const newTemplate = {
          title: workoutTitle,
          exercises: exercises.map(exercise => ({
            title: exercise.title,
            type: exercise.type  // Preserve the exercise type when creating new template
          })),
          lastDoneDate: formattedDate,
          createdAt: new Date().toISOString()
        };
        storage.templates.add(newTemplate);
      }

      // Clear current workout
      storage.currentWorkout.clear();
      
      // Reset state
      setExercises([]);
      setWorkoutTitle('');
      setIsSummaryModalOpen(false);
      
      // Navigate to history page
      navigate('/history');
    } catch (error) {
      console.error('Error completing workout:', error);
      alert('There was an error saving your workout. Please try again.');
    }
  };

  const handleRepsChange = (exerciseId, setIndex, newReps) => {
    const updatedExercises = exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        const updatedSets = [...(exercise.sets || [])];
        if (!updatedSets[setIndex]) {
          updatedSets[setIndex] = {};
        }
        updatedSets[setIndex] = { ...updatedSets[setIndex], reps: newReps };
        return { ...exercise, sets: updatedSets };
      }
      return exercise;
    });
    setExercises(updatedExercises);
    storage.currentWorkout.save(updatedExercises);
  };

  const handleWeightChange = (exerciseId, setIndex, newWeight) => {
    const updatedExercises = exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        const updatedSets = [...(exercise.sets || [])];
        if (!updatedSets[setIndex]) {
          updatedSets[setIndex] = {};
        }
        updatedSets[setIndex] = { ...updatedSets[setIndex], weight: newWeight };
        return { ...exercise, sets: updatedSets };
      }
      return exercise;
    });
    setExercises(updatedExercises);
    storage.currentWorkout.save(updatedExercises);
  };

  const handleAddSet = (exerciseId) => {
    const updatedExercises = exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: [...(exercise.sets || []), { reps: '', weight: '' }]
        };
      }
      return exercise;
    });
    setExercises(updatedExercises);
    storage.currentWorkout.save(updatedExercises);
  };

  const handleRemoveSet = (exerciseId, setIndex) => {
    const updatedExercises = exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        const newSets = [...exercise.sets];
        newSets.splice(setIndex, 1);
        return { ...exercise, sets: newSets };
      }
      return exercise;
    });
    setExercises(updatedExercises);
    storage.currentWorkout.save(updatedExercises);
  };

  const handleDeleteExercise = (exerciseId) => {
    const updatedExercises = exercises.filter(exercise => exercise.id !== exerciseId);
    setExercises(updatedExercises);
    storage.currentWorkout.save(updatedExercises);
  };

  const handleAddExercise = () => {
    storage.currentWorkout.save(exercises);
    navigate('/add-exercise');
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Update the Modal content to use the locally stored data
  const renderExerciseSets = (exercise) => {
    const savedSets = localStorage.getItem(`exercise-${exercise.id}-sets`);
    const exerciseSets = savedSets ? JSON.parse(savedSets) : exercise.sets;

    return (
      <div style={{ 
        display: 'grid',
        gap: '10px'
      }}>
        {exerciseSets && exerciseSets.map((set, setIndex) => (
          <div 
            key={set.setId || setIndex}
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
              {exercise.type === 'weight' && set.weight && set.reps
                ? `${set.weight}kg × ${set.reps} reps`
                : exercise.type === 'bodyweight' && set.reps
                ? `${set.reps} reps`
                : exercise.type === 'timed' && set.time
                ? `${formatTime(set.time)}`
                : 'Not completed'}
            </span>
          </div>
        ))}
        {(!exerciseSets || exerciseSets.length === 0) && (
          <div style={{
            padding: '12px 15px',
            color: '#666',
            fontStyle: 'italic'
          }}>
            No sets recorded
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', maxWidth: '100%', margin: 'auto' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1, maxWidth: '100%', margin: 'auto', backgroundColor: '#fff' }}>
        <Statusbar />
      </div>

      <Container style={{ paddingBottom: '90px', paddingTop: '10px', maxWidth: '100%', margin: 'auto', overflowY: 'auto' }}>
        <Navbar isWorkoutInProgress={setIsWorkoutInProgress} />

        <Group position="apart" style={{ marginTop: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <div style={{ flex: 0.7, display: 'flex', alignItems: 'center' }}>
              {isEditingTitle ? (
                <input
                  type="text"
                  value={workoutTitle}
                  onChange={(e) => setWorkoutTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
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
              onClick={() => setIsEditingTitle((prev) => !prev)}
              style={{ color: isEditingTitle ? '#1e90ff' : '#356B77', marginLeft: '8px' }}
            >
              <MdEdit size={24} />
            </ActionIcon>
          </div>
        </Group>

        <div style={{ marginTop: '1rem' }}>
          {exercises.length > 0 ? (
          exercises.map((exercise) => {
          const key = exercise.id || `${exercise.title}-${Math.random()}`;

          if (exercise.type === 'weight') {
            return (
              <WeightExerciseCard
                key={key}
                id={exercise.id}
                title={exercise.title}
                sets={exercise.sets || []}
                onRepsChange={(setIndex, newReps) => handleRepsChange(exercise.id, setIndex, newReps)}
                onWeightChange={(setIndex, newWeight) => handleWeightChange(exercise.id, setIndex, newWeight)}
                onAddSet={() => handleAddSet(exercise.id)}
                onRemoveSet={(setIndex) => handleRemoveSet(exercise.id, setIndex)}
                onDelete={() => handleDeleteExercise(exercise.id)}
              />
            );
          } else if (exercise.type === 'bodyweight') {
            return (
              <BodyweightExerciseCard
                key={key}
                id={exercise.id}
                title={exercise.title}
                sets={exercise.sets || []}
                onDelete={() => handleDeleteExercise(exercise.id)}
              />
            );
          } else if (exercise.type === 'timed') {
            return (
              <TimedExerciseCard
                key={key}
                id={exercise.id}
                title={exercise.title}
                sets={exercise.sets || []}
                onDelete={() => handleDeleteExercise(exercise.id)}
              />
            );
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

        <ActionIcon
          size='xl'
          variant="transparent"
          style={{ color: '#356B77', marginBottom: '1rem' }}
          onClick={handleAddExercise}
        >
          <MdAddCircleOutline size={50} />
        </ActionIcon>

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

        {/* Workout Summary Modal */}
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
                  key={exercise.id}
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
                  {renderExerciseSets(exercise)}
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
