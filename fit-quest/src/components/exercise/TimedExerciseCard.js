import React, { useState, useEffect } from 'react';
import { Card, Group, Text, TextInput, Button, ActionIcon, Container } from '@mantine/core';
import { MdExpandMore, MdChevronRight, MdEdit, MdDelete } from 'react-icons/md';

function TimedExerciseCard({ title = "Timed Exercise", onDelete }) {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // Time in seconds
  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [exerciseTitle, setExerciseTitle] = useState(title);

  useEffect(() => {
    let timerInterval;
    if (isRunning) {
      timerInterval = setInterval(() => {
        setTime((prevTime) => prevTime + 1); // Increase time by 1 second
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isRunning]);

  const formatTime = () => {
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const toggleTimer = () => {
    if (!editMode) {
      setIsRunning(!isRunning);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleExpandCollapse = () => {
    if (expanded && editMode) {
      setEditMode(false); // Exit edit mode when collapsing
    }
    setExpanded(!expanded);
  };

  return (
    <Card shadow="sm" padding="lg" style={{ backgroundColor: '#879DA2', borderRadius: '8px' }}>
      <Group position="apart" onClick={handleExpandCollapse} style={{ cursor: 'pointer' }}>
        {editMode ? (
          <TextInput
            value={exerciseTitle}
            onChange={(e) => setExerciseTitle(e.target.value)}
            variant="unstyled"
            styles={{ input: { color: 'white', fontWeight: 500, fontSize: '1.2rem' } }}
            placeholder="Edit exercise title"
          />
        ) : (
          <Text color="white" weight={500}>{exerciseTitle}</Text>
        )}
        <Group spacing="xs" style={{ marginLeft: 'auto' }}>
          {expanded && (
            <ActionIcon
              variant="transparent"
              onClick={(e) => {
                e.stopPropagation(); // Prevent collapsing the card when clicking edit
                toggleEditMode();
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
        <Container style={{ textAlign: 'center' }}>
          <Text size="xl" color="white" style={{ fontSize: '3.5rem', fontWeight: 'bold' }}>
            {formatTime()}
          </Text>
          <Button
            onClick={toggleTimer}
            fullWidth
            disabled={editMode} // Disable button when in edit mode
            style={{
              marginTop: '1rem',
              fontSize: '1.8rem',
              backgroundColor: editMode ? '#d3d3d3' : isRunning ? '#356B77' : 'white', // Grey out if in edit mode
              color: editMode ? '#a9a9a9' : isRunning ? 'white' : '#356B77', // Adjust color based on edit mode
              borderRadius: '10px',
              cursor: editMode ? 'not-allowed' : 'pointer', // Show not-allowed cursor in edit mode
            }}
          >
            {isRunning ? 'Stop' : 'Start'}
          </Button>
          <Container style={{ marginTop: '1rem' }}>
            <Text size="m" color="white">Time: --</Text>
            <Text size="m" color="white">Previous: --</Text>
          </Container>

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
                width: '15rem',
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

export default TimedExerciseCard;
