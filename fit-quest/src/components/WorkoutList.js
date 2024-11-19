import React from 'react';

const WorkoutList = ({ items }) => {
  return (
    <div style={{
      borderRadius: '10px',
    //   boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
      backgroundColor: 'white',
    }}>
      {/* Shadow at the top interior */}
      {/* <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '15px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0))',
        zIndex: 10,
        pointerEvents: 'none', // Ensure it doesn't interfere with scrolling
      }} /> */}

      {/* Content inside the scrollable box */}
      <div style={{
        padding: '10px',
        boxSizing: 'border-box',
      }}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} style={{
              marginBottom: '10px',
              padding: '10px',
              borderRadius: '6px',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
              backgroundColor: '#879DA1',
              fontSize: '1.72vh',
              color: 'white',
              borderColor: 'white'
            }}>
              {item}
            </div>
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            color: '#888',
            fontSize: '1.72vh',
            padding: '2.15vh',
          }}>
            No workouts
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutList;
