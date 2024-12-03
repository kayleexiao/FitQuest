import { Container, Group, UnstyledButton, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import storage from '../utils/storage';
import { useState, useEffect } from 'react';

function HistoryPage() {
  const navigate = useNavigate();
  const [historyEntries, setHistoryEntries] = useState([]);

  useEffect(() => {
    const workoutHistory = storage.history.getAll();
    
    // Group workouts by date
    const groupedWorkouts = workoutHistory.reduce((acc, workout) => {
      const date = new Date(workout.date).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit'
      });
      
      if (!acc[date]) {
        acc[date] = [];
      }
      
      acc[date].push({
        ...workout,
        time: new Date(workout.date).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      });
      
      return acc;
    }, {});

    // Convert to array format and sort by date
    const formattedEntries = Object.entries(groupedWorkouts)
      .map(([date, items]) => ({
        date,
        items: items.sort((a, b) => new Date(b.date) - new Date(a.date))
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    setHistoryEntries(formattedEntries);
  }, []);

  const handleWorkoutClick = (workout) => {
    navigate('/history/workout', {
      state: {
        workout: {
          ...workout,
          exercises: workout.exercises.map((exercise) => ({
            title: exercise.title,
            sets: exercise.sets,
            type: exercise.type,
          })),
        },
        previousPage: '/history',
      },
    });
  };

  return (
    <div style={{ position: 'relative', maxWidth: '100%', margin: 'auto' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1, maxWidth: '100%', margin: 'auto', backgroundColor: '#fff' }}>
        <Statusbar />
      </div>
      <Navbar />
      <Container style={{ paddingTop: '10px', maxWidth: '100%', margin: 'auto', overflowY: 'auto' }}>
        <Group spacing={0} direction="column" align="flex-start" style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
          <Text style={{
            textAlign: 'left',
            fontSize: '3.86vh',
            color: '#356B77',
            fontWeight: 650,
            margin: 0,
            padding: 0,
          }}>
            <i>History</i>
          </Text>
        </Group>
      </Container>
        
      <Container 
        fluid
        style={{ 
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '100%',
          paddingBottom: '100px'
        }}
      >
        {historyEntries.length > 0 ? (
          historyEntries.map((dateGroup) => (
            <div key={dateGroup.date} style={{ 
              width: '100%', 
              margin: '0 auto',
              marginBottom: '20px'
            }}>
              <div style={{ 
                padding: '0px 12px', 
                color: '#356B77', 
                fontWeight: 600,
                textAlign: 'left',
                width: '100%',
                marginBottom: '15px'
              }}>
                {dateGroup.date}
              </div>
              
              {dateGroup.items.map((workout, index) => (
                <UnstyledButton
                  key={`${dateGroup.date}-${index}`}
                  onClick={() => handleWorkoutClick(workout)}
                  style={{
                    width: '100%',
                    backgroundColor: '#879DA1',
                    borderRadius: 25,
                    padding: '15px 20px',
                    marginBottom: '15px',
                  }}
                >
                  <Group position="apart" align="center">
                    <div>
                      <Text weight={500} size="lg" style={{ color: 'white' }}>
                        {workout.title}
                      </Text>
                      <Group spacing="xs">
                        <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {workout.time}
                        </Text>
                        <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          •
                        </Text>
                        <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {workout.exercises?.length || 0} exercises
                        </Text>
                      </Group>
                    </div>
                    <Text style={{ 
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      marginLeft: '25vw'
                    }}>
                      ›
                    </Text>
                  </Group>
                </UnstyledButton>
              ))}
            </div>
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666',
            fontSize: '16px',
            width: '100%'
          }}>
            No workout history
          </div>
        )}
      </Container>
    </div>
  );
}

export default HistoryPage;