import React from 'react';
import { useNavigate } from 'react-router-dom';

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
      borderRadius: '10px',
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
                marginBottom: '10px',
                padding: '10px',
                borderRadius: '6px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                backgroundColor: '#879DA1',
                fontSize: '1.72vh',
                color: 'white',
                borderColor: 'white',
                cursor: 'pointer',
              }}
            >
              {formatWorkoutContent(item)}
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