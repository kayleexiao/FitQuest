import React, { useState, useEffect } from 'react';
import { ActionIcon, Button, Card, Container, Grid, Group, Text, TextInput, Textarea } from '@mantine/core';
import { MdAdd, MdChevronRight, MdDelete, MdEdit, MdExpandMore, MdRemoveCircleOutline } from 'react-icons/md';
import storage from '../../utils/storage';

function BodyweightExerciseCard({ 
  id,
  title = "Exercise",
  onDelete,
  onSetsChange,
  initialSets = []
}) {
  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [exerciseTitle, setExerciseTitle] = useState(title);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notes, setNotes] = useState('');
  const [previousWorkout, setPreviousWorkout] = useState(null);
  
  const [sets, setSets] = useState(() => {
    const savedSets = localStorage.getItem(`exercise-${id}-sets`);
    if (savedSets) {
      return JSON.parse(savedSets);
    }
    return initialSets.length > 0 
      ? initialSets 
      : [{ setId: Date.now(), reps: '', timestamp: Date.now() }];
  });

  useEffect(() => {
    const workoutHistory = storage.history.getAll();
    const sortedWorkouts = workoutHistory.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    const lastWorkout = sortedWorkouts.find(workout => 
      workout.exercises.some(exercise => 
        exercise.title.toLowerCase() === title.toLowerCase()
      )
    );

    if (lastWorkout) {
      const exercise = lastWorkout.exercises.find(ex => 
        ex.title.toLowerCase() === title.toLowerCase()
      );
      if (exercise) {
        setPreviousWorkout(exercise);
      }
    }
  }, [title]);

  useEffect(() => {
    const savedNotes = localStorage.getItem(`exercise-${id}-notes`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [id]);

  useEffect(() => {
    if (onSetsChange) {
      onSetsChange(id, sets);
    }
    localStorage.setItem(`exercise-${id}-sets`, JSON.stringify(sets));
    localStorage.setItem(`exercise-${id}-notes`, notes);
  }, [sets, notes, onSetsChange, id]);

  const addSet = (e) => {
    e.stopPropagation();
    const newSet = {
      setId: Date.now(),
      reps: '',
      timestamp: Date.now()
    };
    setSets([...sets, newSet]);
  };

  const removeSet = (index, e) => {
    e.stopPropagation();
    const newSets = sets.filter((_, i) => i !== index);
    setSets(newSets);
  };

  const handleInputChange = (index, value) => {
    const sanitizedValue = value.replace(/[^\d]/g, '');
    if (sanitizedValue.length > 1 && sanitizedValue[0] === '0') return;

    const newSets = sets.map((set, i) => {// BodyweightExerciseCard.js (continued)
      if (i === index) {
        return { 
          ...set, 
          reps: sanitizedValue,
          timestamp: Date.now()
        };
      }
      return set;
    });

    setSets(newSets);
  };

  const toggleEditMode = (e) => {
    e.stopPropagation();
    if (editMode) setConfirmDelete(false);
    setEditMode(!editMode);
  };

  const handleExpand = () => {
    if (expanded && editMode) {
      setEditMode(false);
      setConfirmDelete(false);
    }
    setExpanded(!expanded);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDelete();
    } else {
      setConfirmDelete(true);
    }
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  return (
    <Card shadow="sm" padding="lg" style={{ marginBottom: '2rem', marginTop: '2rem', backgroundColor: '#879DA2', borderRadius: '8px' }}>
      <Group position="apart" align="center" style={{ cursor: 'pointer' }} onClick={handleExpand}>
        {editMode ? (
          <TextInput
            value={exerciseTitle}
            onChange={(e) => setExerciseTitle(e.target.value)}
            variant="unstyled"
            onClick={(e) => e.stopPropagation()}
            styles={{ input: { color: 'white', fontWeight: 500, fontSize: '1.2rem' } }}
            placeholder="Enter exercise title"
          />
        ) : (
          <Text color="white" weight={500} style={{ textAlign: 'left' }}>{exerciseTitle}</Text>
        )}
        <Group spacing="xs" style={{ marginLeft: 'auto' }}>
          {expanded && (
            <ActionIcon
              variant="transparent"
              onClick={toggleEditMode}
              style={{ color: editMode ? '#1e90ff' : 'white' }}
            >
              <MdEdit size={24} />
            </ActionIcon>
          )}
          <ActionIcon variant="transparent">
            {expanded ? <MdExpandMore size={24} color="white" /> : <MdChevronRight size={24} color="white" />}
          </ActionIcon>
        </Group>
      </Group>

      {expanded && (
        <Container>
          {sets.length > 0 && (
            <Grid align="center" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
              {editMode && <Grid.Col span={2}></Grid.Col>}
              <Grid.Col span={2}>
                <Text color="white" align="left"></Text>
              </Grid.Col>
              <Grid.Col span={editMode ? 4 : 4}>
                <Text color="white" weight={500} align="center">Previous</Text>
              </Grid.Col>
              <Grid.Col span={editMode ? 3 : 6}>
                <Text color="white" align="center">Reps</Text>
              </Grid.Col>
            </Grid>
          )}

          {sets.map((set, index) => (
            <Grid key={set.setId} align="center" gutter="xs" style={{ marginBottom: '1.5rem' }}>
              {editMode && (
                <Grid.Col span={2} style={{ textAlign: 'center' }}>
                  <ActionIcon
                    variant="transparent"
                    onClick={(e) => removeSet(index, e)}
                    style={{ color: 'red', backgroundColor: 'transparent' }}
                  >
                    <MdRemoveCircleOutline size={20} />
                  </ActionIcon>
                </Grid.Col>
              )}
              <Grid.Col span={1}>
                <Text color="white" style={{ textAlign: 'left' }}>{index + 1}</Text>
              </Grid.Col>
              <Grid.Col span={editMode ? 5 : 6}>
                <Text color="white" align="center">
                  {previousWorkout && previousWorkout.sets && previousWorkout.sets[index]
                    ? `${previousWorkout.sets[index].reps} reps`
                    : '-- reps'}
                </Text>
              </Grid.Col>
              <Grid.Col span={editMode ? 3 : 5}>
                <TextInput
                  placeholder="Reps"
                  value={set.reps}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  variant="filled"
                  onClick={(e) => e.stopPropagation()}
                  styles={{
                    input: {
                      textAlign: 'center',
                      padding: '0.2rem',
                      backgroundColor: '#879DA2',
                      color: 'white',
                    },
                  }}
                />
              </Grid.Col>
            </Grid>
          ))}

          <div style={{ marginTop: '15px' }}>
            <Text weight={500} style={{ color: 'white', marginBottom: '5px' }}>
              Notes:
            </Text>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes here"
              autosize
              minRows={2}
              maxRows={10}
              variant="filled"
              styles={{
                input: {
                  padding: '0.5rem',
                  backgroundColor: 'white',
                  color: '#356B77',
                  borderRadius: '8px',
                  fontSize: '1rem',
                },
              }}
            />
          </div>

          {!editMode && (
            <Group position="center" style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
              <ActionIcon
                variant="outline"
                onClick={addSet}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '2px solid white',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '10px'
                }}
              >
                <MdAdd size={20} />
              </ActionIcon>
            </Group>
          )}

          {editMode && confirmDelete ? (
            <Group position="center" style={{ marginTop: '1rem' }}>
              <Button
                onClick={handleDelete}
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  width: '8rem'
                }}
              >
                Confirm
              </Button>
              <Button
                onClick={cancelDelete}
                style={{
                  backgroundColor: 'grey',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  width: '8rem',
                  marginRight: '1rem'
                }}
              >
                Cancel
              </Button>
            </Group>
          ) : (
            editMode && (
              <Button
                onClick={handleDelete}
                fullWidth
                style={{
                  marginTop: '1rem',
                  backgroundColor: 'red',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '10px'
                }}
              >
                <MdDelete size={20} style={{ marginRight: '0.5rem' }} />
                Delete Exercise
              </Button>
            )
          )}
        </Container>
      )}
    </Card>
  );
}

export default BodyweightExerciseCard;