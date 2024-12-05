import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from '@mantine/core';

const WorkoutList = ({ items, isLoading }) => {
  const navigate = useNavigate();

  const handleWorkoutClick = (workout) => {
    navigate('/history/workout', { 
      state: { 
        workout,
        previousPage: window.location.pathname
      }
    });
  };

  const formatWorkoutContent = (workout) => {
    return `${workout.title} - ${workout.time}`;
  };

  return (
    <div style={{
      borderRadius: '20px',
      backgroundColor: 'white',
    }}>
      <div style={{
        padding: '10px',
        boxSizing: 'border-box',
      }}>
        {isLoading ? (
          <div style={{
            textAlign: 'center',
            color: '#888',
            fontSize: '1.72vh',
            padding: '2.15vh',
          }}>
            Loading...
          </div>
        ) : items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={index}
              onClick={() => handleWorkoutClick(item)}
              style={{
                textAlign: 'left',
                marginBottom: '7.5px',
                padding: '15px',
                borderRadius: '20px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                backgroundColor: '#879DA1',
                fontSize: '1.8vh',
                color: 'white',
                borderColor: 'white',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {formatWorkoutContent(item)}
              <Text style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
              }}>
                ›
              </Text>
            </div>
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            color: '#888',
            fontSize: '1.72vh',
            padding: '2.15vh',
          }}>
            No workouts on this date
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutList;