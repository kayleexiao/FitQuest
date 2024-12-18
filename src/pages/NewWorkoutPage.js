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
    return Array.isArray(savedExercises) ? savedExercises : [];
  });
  const [workoutTitle, setWorkoutTitle] = useState('New Workout');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const savedTitle = localStorage.getItem('currentWorkoutTitle');
    if (savedTitle) {
      setWorkoutTitle(savedTitle);
    } else if (workoutTemplate?.title) {
      setWorkoutTitle(workoutTemplate.title);
      localStorage.setItem('currentWorkoutTitle', workoutTemplate.title);
    }
  }, [workoutTemplate]);
  
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setWorkoutTitle(newTitle);
    localStorage.setItem('currentWorkoutTitle', newTitle);
  };

  useEffect(() => {
    if (workoutTemplate) {
      setWorkoutTitle(workoutTemplate.title);
      const exercises = Array.isArray(workoutTemplate.exercises) ? workoutTemplate.exercises : [];
      const exercisesWithIds = exercises.map(exercise => ({
        ...exercise,
        id: exercise.id || Date.now() + Math.random()
      }));
      setExercises(exercisesWithIds);
      storage.currentWorkout.save(exercisesWithIds);
    } else {
      const returnedExercises = location.state?.exercises;
      if (Array.isArray(returnedExercises)) {
        const exercisesWithIds = returnedExercises.map(exercise => ({
          ...exercise,
          id: exercise.id || Date.now() + Math.random()
        }));
        setExercises(exercisesWithIds);
        storage.currentWorkout.save(exercisesWithIds);
      }
    }
  }, [workoutTemplate, location.state]);

  useEffect(() => {
    if (setIsWorkoutInProgress) {
      setIsWorkoutInProgress(true);
    }
    return () => {
      if (setIsWorkoutInProgress) {
        setIsWorkoutInProgress(false);
      }
    };
  }, [setIsWorkoutInProgress]);

  const handleFinishWorkout = () => {
    if (setIsWorkoutInProgress) {
      setIsWorkoutInProgress(false);
    }
    setIsSummaryModalOpen(true);
  };

  const handleCompleteWorkout = () => {
    try {
      const completionDate = new Date().toISOString();
      const formattedDate = new Date().toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
      });
      
      // Get the latest sets data and notes from localStorage for each exercise
      const updatedExercises = exercises.map(exercise => {
        const savedSets = localStorage.getItem(`exercise-${exercise.id}-sets`);
        const parsedSets = savedSets ? JSON.parse(savedSets) : exercise.sets;
        const savedNotes = localStorage.getItem(`exercise-${exercise.id}-notes`);

        const filteredSets = Array.isArray(parsedSets)
        ? parsedSets.filter(set => 
            (set?.reps && set.reps !== '') || 
            (set?.weight && set.weight !== '') || 
            (set?.time && set.time !== '')
          )
        : [];

        return {
          ...exercise,
          sets: savedSets ? filteredSets : exercise.sets,
          notes: savedNotes || ''
        };
      });
      
      // Format workout data for history
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
          })) : [],
          notes: exercise.notes
        }))
      };
  
      // Save to history
      storage.history.add(workoutHistory);
  
      // Handle template saving/updating
      if (workoutTemplate) {
        // This is a workout started from saved page - update the template's last done date
        // but DON'T update the template's exercises
        const savedTemplates = storage.templates.getAll();
        const updatedTemplates = savedTemplates.map(template => {
          if (template.title === workoutTemplate.title) {
            return {
              ...template,
              lastDoneDate: formattedDate
            };
          }
          return template;
        });
        storage.templates.save(updatedTemplates);
      } else {
        // Only save as new template if this wasn't started from a template
        const newTemplate = {
          title: workoutTitle,
          exercises: exercises.map(exercise => ({
            title: exercise.title,
            type: exercise.type
          })),
          lastDoneDate: formattedDate,
          createdAt: new Date().toISOString()
        };
        storage.templates.add(newTemplate);
      }
  
      // Clear current workout
      storage.currentWorkout.clear();
      localStorage.removeItem('currentWorkoutTitle');
      
      // Reset state
      setExercises([]);
      setWorkoutTitle('New Workout');
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
    localStorage.setItem('currentWorkoutTitle', workoutTitle);
    navigate('/add-exercise');
  };

  const handleDeleteWorkout = () => {
    if (confirmDelete) {
      storage.currentWorkout.clear();
      localStorage.removeItem('currentWorkoutTitle');
      setExercises([]);
      setWorkoutTitle('New Workout');
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };

  const cancelDeleteWorkout = () => {
    setConfirmDelete(false);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const renderExerciseSets = (exercise) => {
    const savedSets = localStorage.getItem(`exercise-${exercise.id}-sets`);
    const exerciseSets = savedSets ? JSON.parse(savedSets) : exercise.sets;
    const savedNotes = localStorage.getItem(`exercise-${exercise.id}-notes`);
  
    return (
      <>
        {exerciseSets?.map((set, setIndex) => (
          <Group key={setIndex} position="apart" style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '8px 12px',
            borderRadius: '8px',
            marginBottom: '5px'
          }}>
            <Text size="sm" style={{ color: 'white' }}>Set {setIndex + 1}</Text>
            <Text size="sm" style={{ color: 'white' }}>
              {exercise.type === 'weight'
                ? `${set.weight}kg × ${set.reps} reps`
                : exercise.type === 'bodyweight'
                ? `${set.reps} reps`
                : `${formatTime(set.time)}`}
            </Text>
          </Group>
        ))}
        <div style={{ marginTop: '15px' }}>
          <Text weight={500} style={{ color: 'white', marginBottom: '5px' }}>
            Notes:
          </Text>
          <Text style={{ 
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '8px 12px',
            borderRadius: '8px',
            fontStyle: savedNotes ? 'normal' : 'italic'
          }}>
            {savedNotes || 'No notes added'}
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
        <Navbar isWorkoutInProgress={setIsWorkoutInProgress} />

        <Group position="apart" style={{ marginTop: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <div style={{ flex: 0.7, display: 'flex', alignItems: 'center' }}>
              {isEditingTitle ? (
                <input
                type="text"
                value={workoutTitle}
                onChange={handleTitleChange}
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
              style={{ color: isEditingTitle ? '#1e90ff' : '#356B77'}}
            >
              <MdEdit size={24} />
            </ActionIcon>
          </div>
          <div style={{ position: 'absolute', top: '3.5rem', right: '1rem' }}>
            {confirmDelete ? (
              <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
                <Button
                  onClick={() => cancelDeleteWorkout()}
                  style={{
                    backgroundColor: 'grey',
                    color: 'white',
                    borderRadius: '20px',
                    padding: '5px 10px',
                    fontSize: '14px',
                    height: '36px'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleDeleteWorkout();
                  }}
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '20px',
                    padding: '5px 10px',
                    fontSize: '14px',
                    height: '36px'
                  }}
                >
                  Confirm
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleDeleteWorkout}
                fullWidth
                style={{
                  marginTop: '0rem',
                  backgroundColor: '#356B77',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '20px',
                  width: 'auto',
                  fontSize: '14px',
                  height: '36px'
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </Group>

        <div style={{ marginTop: '2.5rem' }}>
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
                onRepsChange={(setIndex, newReps) => handleRepsChange(exercise.id, setIndex, newReps)}
                onAddSet={() => handleAddSet(exercise.id)}
                onRemoveSet={(setIndex) => handleRemoveSet(exercise.id, setIndex)}
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
                onTimeChange={(setIndex, newTime) => {
                  const updatedExercises = exercises.map(ex => {
                    if (ex.id === exercise.id) {
                      const updatedSets = [...(ex.sets || [])];
                      if (!updatedSets[setIndex]) {
                        updatedSets[setIndex] = {};
                      }
                      updatedSets[setIndex] = { ...updatedSets[setIndex], time: newTime };
                      return { ...ex, sets: updatedSets };
                    }
                    return ex;
                  });
                  setExercises(updatedExercises);
                  storage.currentWorkout.save(updatedExercises);
                }}
                onAddSet={() => handleAddSet(exercise.id)}
                onRemoveSet={(setIndex) => handleRemoveSet(exercise.id, setIndex)}
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
              borderRadius: '20px',
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
              marginBottom: '20px',
            }}>
              <h2 style={{
                color: '#356B77',
                margin: 0,
                fontSize: '28px',
              }}>
                {workoutTitle || 'Workout'} Complete!
              </h2>
              <span style={{ color: '#666', }}>
                {new Date().toLocaleDateString()}
              </span>
            </div>

            <div style={{ marginBottom: '30px' }}>
              {exercises?.map((exercise, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#879DA1',
                    marginBottom: '1rem',
                    padding: '15px',
                    borderRadius: '15px',
                  }}
                >
                  <Text weight={500} style={{ color: 'white', marginBottom: '10px' }}>
                    {exercise.title}
                  </Text>
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
                  borderRadius: '20px',
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
                  borderRadius: '20px',
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