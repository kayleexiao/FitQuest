// components/WeightExerciseCard.js
import React, { useState } from 'react';
import { Card, Group, Text, ActionIcon, TextInput, Button, Container, Grid } from '@mantine/core';
import { MdExpandMore, MdChevronRight, MdAdd, MdEdit, MdDelete, MdRemoveCircleOutline } from 'react-icons/md';

function WeightExerciseCard({ title = "Exercise", onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [exerciseTitle, setExerciseTitle] = useState(title);
  const [rows, setRows] = useState([{ id: 1, previous: '-- kg x -- reps' }, { id: 2, previous: '-- kg x -- reps' }, { id: 3, previous: '-- kg x -- reps' }]);

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
        {editMode ? (
          <TextInput
            value={exerciseTitle}
            onChange={(e) => setExerciseTitle(e.target.value)}
            variant="unstyled"
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
              onClick={(e) => {
                e.stopPropagation(); // Prevent collapsing the card when clicking edit
                toggleEditMode(); // Toggle edit mode on click
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
              <Grid.Col span={editMode ? 2.8 : 1}></Grid.Col>
              <Grid.Col span={5}>
                <Text color="white" weight={500} align="center">Previous</Text>
              </Grid.Col>
              <Grid.Col span={editMode ? 2 : 3}>
                <Text color="white" align="center">Rep</Text>
              </Grid.Col>
              <Grid.Col span={editMode ? 2 : 3}>
                <Text color="white" align="center">KG</Text>
              </Grid.Col>
            </Grid>
          )}

          {rows.map((row, index) => (
            <Grid key={index} align="center" gutter="xs" style={{ marginBottom: '1.5rem' }}>
              {editMode && (
                <Grid.Col span="auto" style={{ textAlign: 'center', maxWidth: 'auto' }}>
                  <ActionIcon
                    variant="transparent"
                    onClick={() => deleteRow(index)}
                    style={{ color: 'red' }}
                  >
                    <MdRemoveCircleOutline size={20} />
                  </ActionIcon>
                </Grid.Col>
              )}
              <Grid.Col span={1}>
                <Text color="white" style={{ textAlign: 'left' }}>{index + 1}</Text>
              </Grid.Col>
              <Grid.Col span={5}>
                <Text color="white" align="center">{row.previous}</Text>
              </Grid.Col>
              <Grid.Col span={editMode ? 2 : 3}>
                <TextInput
                  placeholder="Reps"
                  variant="filled"
                  type="number" // Only allows numeric input
                  styles={{
                    input: {
                      textAlign: 'center',
                      padding: '0.2rem',
                      backgroundColor: '#879DA2', // Matches card background color
                      color: 'white',
                    },
                  }}
                />
              </Grid.Col>
              <Grid.Col span={editMode ? 2 : 3}>
                <TextInput
                  placeholder="KG"
                  variant="filled"
                  type="number" // Only allows numeric input
                  styles={{
                    input: {
                      textAlign: 'center',
                      padding: '0.2rem',
                      backgroundColor: '#879DA2', // Matches card background color
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
                onClick={addRow}
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
                onClick={onDelete}
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

export default WeightExerciseCard;
