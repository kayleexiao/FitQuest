import React, { useState, useEffect } from 'react';
import { ActionIcon, Button, Card, Container, Grid, Group, Text, TextInput } from '@mantine/core';
import { MdAdd, MdChevronRight, MdDelete, MdEdit, MdExpandMore, MdRemoveCircleOutline } from 'react-icons/md';

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

  const [sets, setSets] = useState(initialSets.length > 0 
    ? initialSets 
    : [{ setId: Date.now(), reps: '', timestamp: Date.now() }]
  );

  useEffect(() => {
    if (onSetsChange) {
      onSetsChange(id, sets);
    }
  }, [sets, onSetsChange, id]);

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
    // Only allow positive integers for reps
    const sanitizedValue = value.replace(/[^\d]/g, '');

    // Prevent leading zeros
    if (sanitizedValue.length > 1 && sanitizedValue[0] === '0') return;

    const newSets = sets.map((set, i) => {
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
    setEditMode(!editMode);
  };

  const handleExpand = () => {
    if (expanded && editMode) setEditMode(false);
    setExpanded(!expanded);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
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
              <Grid.Col span={editMode ? 2.8 : 1}></Grid.Col>
              <Grid.Col span={6}>
                <Text color="white" weight={500} align="center">Previous</Text>
              </Grid.Col>
              <Grid.Col span={editMode ? 2 : 5}>
                <Text color="white" align="center">Reps</Text>
              </Grid.Col>
            </Grid>
          )}

          {sets.map((set, index) => (
            <Grid key={set.setId} align="center" gutter="xs" style={{ marginBottom: '1.5rem' }}>
              {editMode && (
                <Grid.Col span="auto" style={{ textAlign: 'center', maxWidth: 'auto' }}>
                  <ActionIcon
                    variant="transparent"
                    onClick={(e) => removeSet(index, e)}
                    style={{ color: 'red' }}
                  >
                    <MdRemoveCircleOutline size={20} />
                  </ActionIcon>
                </Grid.Col>
              )}
              <Grid.Col span={1}>
                <Text color="white" style={{ textAlign: 'left' }}>{index + 1}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text color="white" align="center">-- reps</Text>
              </Grid.Col>
              <Grid.Col span={editMode ? 2 : 5}>
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
                }}
              >
                <MdAdd size={20} />
              </ActionIcon>
            </Group>
          )}

          {editMode && (
            <Button
              onClick={handleDelete}
              fullWidth
              style={{
                marginTop: '1rem',
                left: '2rem',
                backgroundColor: 'red',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '10px',
                width: '15rem'
              }}
            >
              <MdDelete size={20} style={{ marginRight: '0.5rem' }} />
              Delete Exercise
            </Button>
          )}
        </Container>
      )}
    </Card>
  );
}

export default BodyweightExerciseCard;