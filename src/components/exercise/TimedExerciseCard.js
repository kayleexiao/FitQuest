import React, { useState, useEffect } from 'react';
import { ActionIcon, Button, Card, Container, Grid, Group, Text, TextInput, Textarea } from '@mantine/core';
import { MdAdd, MdChevronRight, MdDelete, MdEdit, MdExpandMore, MdRemoveCircleOutline } from 'react-icons/md';

function TimedExerciseCard({ 
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
  const [activeSet, setActiveSet] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [notes, setNotes] = useState('');

  const [sets, setSets] = useState(() => {
    const savedSets = localStorage.getItem(`exercise-${title}-${id}-sets`);
    if (savedSets) {
      return JSON.parse(savedSets);
    }
    return initialSets.length > 0 
      ? initialSets 
      : [{ setId: Date.now(), time: 0, isActive: false, timestamp: Date.now() }];
  });

  // Timer effect
  useEffect(() => {
    let interval;
    if (activeSet !== null) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
        setSets(prevSets => prevSets.map(set => {
          if (set.setId === activeSet) {
            return { ...set, time: currentTime + 1 };
          }
          return set;
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSet, currentTime]);

  useEffect(() => {
    const savedNotes = localStorage.getItem(`exercise-${title}-${id}-notes`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [id, title]);

  useEffect(() => {
    if (onSetsChange) {
      onSetsChange(id, sets);
    }
    localStorage.setItem(`exercise-${title}-${id}-sets`, JSON.stringify(sets));
    localStorage.setItem(`exercise-${title}-${id}-notes`, notes);
  }, [sets, notes, onSetsChange, id, title]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const parseTimeInput = (timeString) => {
    const [hrs = '0', mins = '0', secs = '0'] = timeString.split(':');
    return (
      parseInt(hrs, 10) * 3600 +
      parseInt(mins, 10) * 60 +
      parseInt(secs, 10)
    );
  };

  const handleTimeEdit = (setId, timeString) => {
    if (!/^[\d:]*$/.test(timeString)) return;

    let formatted = timeString.replace(/[^0-9:]/g, '');
    const colonCount = (formatted.match(/:/g) || []).length;
    if (colonCount > 2) return;

    setSets(prevSets => prevSets.map(set => {
      if (set.setId === setId) {
        return { ...set, timeInput: formatted };
      }
      return set;
    }));
  };

  const handleTimeEditComplete = (setId) => {
    setSets(prevSets => prevSets.map(set => {
      if (set.setId === setId && set.timeInput) {
        const timeValue = parseTimeInput(set.timeInput);
        return { 
          ...set, 
          time: timeValue,
          timeInput: undefined
        };
      }
      return set;
    }));
  };

  const toggleTimer = (setId, e) => {
    e.stopPropagation();
    if (editMode) return;

    if (activeSet === setId) {
      setActiveSet(null);
      setSets(prevSets => prevSets.map(set => {
        if (set.setId === setId) {
          return { ...set, isActive: false };
        }
        return set;
      }));
    } else {
      const set = sets.find(s => s.setId === setId);
      setActiveSet(setId);
      setCurrentTime(set?.time || 0);
      setSets(prevSets => prevSets.map(set => {
        if (set.setId === setId) {
          return { ...set, isActive: true };
        }
        return { ...set, isActive: false };
      }));
    }
  };

  const addSet = (e) => {
    e.stopPropagation();
    const newSet = {
      setId: Date.now(),
      time: 0,
      isActive: false,
      timestamp: Date.now()
    };
    setSets([...sets, newSet]);
  };

  const removeSet = (index, e) => {
    e.stopPropagation();
    const setToRemove = sets[index];
    if (setToRemove.setId === activeSet) {
      setActiveSet(null);
    }
    const newSets = sets.filter((_, i) => i !== index);
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
      localStorage.removeItem(`exercise-${title}-${id}-sets`);
      localStorage.removeItem(`exercise-${title}-${id}-notes`);
      onDelete();
      setActiveSet(null);
    } else {
      setConfirmDelete(true);
    }
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  const findPR = (exerciseTitle) => {
    const matchingSets = [];
  
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
  
      if (key.startsWith(`exercise-`) && key.includes(`-${exerciseTitle}-`) && key.endsWith(`-sets`)) {
        const savedSets = localStorage.getItem(key);
  
        if (savedSets) {
          try {
            const parsedSets = JSON.parse(savedSets);
            if (Array.isArray(parsedSets)) {
              parsedSets.forEach((set) => {
                const savedEntry = localStorage.getItem(`exercise-${exerciseTitle}-${set.setId}-saved`);
                
                if (savedEntry) {
                  matchingSets.push(set);
                }
              });
            }
          } catch (error) {
            console.error(`Error parsing sets for key ${key}:`, error);
          }
        }
      }
    }
  
    if (matchingSets.length === 0) {
      return { time: 0 };
    }
  
    return matchingSets.reduce((minSet, currentSet) => {
      const currentTime = parseFloat(currentSet.time) || 0; // Use Infinity for invalid time
      const minTime = parseFloat(minSet.time) || 0;
  
      if (currentTime > minTime) {
        return currentSet;
      }
      return minSet;
    }, { time: '00:00:00' });
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
          <Text size="xl" color="white" style={{ fontSize: '3.5rem', fontWeight: 'bold', textAlign: 'center', marginTop: '1rem' }}>
            {formatTime(activeSet !== null ? currentTime : 0)}
          </Text>

          {sets.length > 0 && (
            <Grid align="center" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
              {editMode && <Grid.Col span={2}></Grid.Col>}
              <Grid.Col span={2}>
                <Text color="white" align="left"></Text>
              </Grid.Col>
              <Grid.Col span={editMode ? 4 : 4}>
                <Text color="white" weight={500} align="center">Personal Best</Text>
              </Grid.Col>
              <Grid.Col span={editMode ? 3 : 6}>
                <Text color="white" align="center">Time</Text>
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
                    style={{
                      color: 'red',
                      backgroundColor: 'transparent'
                    }}
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
                  {(() => {
                    const highestSet = findPR(title);
                    return highestSet && highestSet.time > 0
                      ? `${formatTime(highestSet.time)}`
                      : '--:--:--';
                  })()}
                </Text>
              </Grid.Col>
              <Grid.Col span={editMode ? 4 : 5}>
                {editMode ? (
                  <TextInput
                    value={set.timeInput || formatTime(set.time)}
                    onChange={(e) => handleTimeEdit(set.setId, e.target.value)}
                    onBlur={() => handleTimeEditComplete(set.setId)}
                    placeholder="00:00:00"
                    variant="filled"
                    onClick={(e) => e.stopPropagation()}
                    styles={{
                      input: {
                        textAlign: 'center',
                        height: '36px',
                        padding: '0 10px',
                        fontSize: '1rem',
                        backgroundColor: '#879DA2',
                        color: 'white',
                        '&::placeholder': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      },
                      wrapper: {
                        width: '100%',
                      }
                    }}
                  />
                ) : (
                  <Button
                    fullWidth
                    onClick={(e) => toggleTimer(set.setId, e)}
                    style={{
                      backgroundColor: set.isActive ? '#FF4444' : '#356B77',
                      color: 'white',
                      height: '36px',
                      padding: '0 10px',
                      fontSize: '1rem'
                    }}
                  >
                    {set.isActive ? 'Stop' : formatTime(set.time)}
                  </Button>
                )}
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
                  borderRadius: '10px',
                  width: '15rem'
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

export default TimedExerciseCard;