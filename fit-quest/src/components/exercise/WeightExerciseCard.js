// components/WeightExerciseCard.js
import React, { useState, useEffect } from 'react';
import { Card, Group, Text, ActionIcon, TextInput, Button, Container, Grid } from '@mantine/core';
import { MdExpandMore, MdChevronRight, MdAdd, MdEdit, MdDelete, MdRemoveCircleOutline } from 'react-icons/md';

function WeightExerciseCard({ title, sets, onRepsChange, onWeightChange, onAddSet, onRemoveSet, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [exerciseTitle, setExerciseTitle] = useState(title);
  const [rows, setRows] = useState(
    sets.map(set => ({
      id: Math.random(),
      reps: set.reps || '',
      weight: set.weight || '',
      previous: '-- kg x -- reps'
    }))
  );

  useEffect(() => {
    const updatedRows = sets.map((set, index) => ({
      id: rows[index]?.id || Math.random(),
      reps: set.reps || '',
      weight: set.weight || '',
      previous: '-- kg x -- reps'
    }));
    setRows(updatedRows);
  }, [sets]);

  const handleRepsChange = (index, value) => {
    try {
      const newRows = [...rows];
      newRows[index] = {
        ...newRows[index],
        reps: value
      };
      setRows(newRows);
      onRepsChange(index, value);
    } catch (error) {
      console.error('Error updating reps:', error);
    }
  };

  const handleWeightChange = (index, value) => {
    try {
      const newRows = [...rows];
      newRows[index] = {
        ...newRows[index],
        weight: value
      };
      setRows(newRows);
      onWeightChange(index, value);
    } catch (error) {
      console.error('Error updating weight:', error);
    }
  };

  const addRow = () => {
    setRows([...rows, { id: rows.length + 1, previous: '-- kg x -- reps' }]);
  };

  const deleteRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleExpand = () => {
    if (expanded && editMode) setEditMode(false); // Exit edit mode when collapsing
    setExpanded(!expanded);
  };

  return (
    <Card shadow="sm" padding="lg" style={{ marginBottom: '2rem', marginTop: '2rem', backgroundColor: '#879DA2', borderRadius: '8px' }}>
      <Group position="apart" align="center" style={{ cursor: 'pointer' }} onClick={handleExpand}>
        <Text color="white" weight={500} style={{ textAlign: 'left' }}>{exerciseTitle}</Text>
        <Group spacing="xs" style={{ marginLeft: 'auto' }}>
          {expanded && (
            <ActionIcon
              variant="transparent"
              onClick={(e) => {
                e.stopPropagation();
                setEditMode(!editMode);
              }}
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
          {rows.length > 0 && (
            <Grid align="center" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
              <Grid.Col span={1}>
                <Text color="white" weight={500} align="center"></Text>
              </Grid.Col>
              <Grid.Col span={5}>
                <Text color="white" weight={500} align="center">Previous</Text>
              </Grid.Col>
              <Grid.Col span={3}>
                <Text color="white" align="center">Rep</Text>
              </Grid.Col>
              <Grid.Col span={3}>
                <Text color="white" align="center">KG</Text>
              </Grid.Col>
            </Grid>
          )}

          {sets.map((set, index) => (
            <Grid key={index} align="center" gutter="xs" style={{ marginBottom: '1.5rem' }}>
              <Grid.Col span={1}>
                {editMode ? (
                  <ActionIcon
                    variant="transparent"
                    onClick={() => onRemoveSet(index)}
                    style={{ color: 'white' }}
                  >
                    <MdRemoveCircleOutline size={20} />
                  </ActionIcon>
                ) : (
                  <Text color="white" style={{ textAlign: 'left' }}>{index + 1}</Text>
                )}
              </Grid.Col>
              <Grid.Col span={5}>
                <Text color="white" align="center">{set.previous || '-- kg x -- reps'}</Text>
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  placeholder="Reps"
                  variant="filled"
                  type="number"
                  value={set.reps}
                  onChange={(e) => onRepsChange(index, e.target.value)}
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
              <Grid.Col span={3}>
                <TextInput
                  placeholder="KG"
                  variant="filled"
                  type="number"
                  value={set.weight}
                  onChange={(e) => onWeightChange(index, e.target.value)}
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
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              width: '100%',
              marginTop: '1.5rem',
              marginBottom: '0.5rem'
            }}>
              <ActionIcon
                variant="outline"
                onClick={onAddSet}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '2px solid white',
                  color: 'white',
                }}
              >
                <MdAdd size={20} />
              </ActionIcon>
            </div>
          )}

          {editMode && (
            <Button
              onClick={onDelete}
              fullWidth
              style={{
                marginTop: '1rem',
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

export default WeightExerciseCard;
