import React from 'react';

const Calendar = ({ selectedMonth, selectedYear, selectedDay, onDayClick, workoutDates }) => {
  const currentDate = new Date();
  const monthIndex = new Date(`${selectedMonth} 1, ${selectedYear}`).getMonth();
  const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
  const firstDayIndex = new Date(selectedYear, monthIndex, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDayIndex }, (_, i) => null);
  const calendarDays = [...emptySlots, ...days];

  while (calendarDays.length < 42) {
    calendarDays.push(null);
  }

  const rows = Math.ceil(calendarDays.length / 7);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      borderStyle: 'solid',
      borderColor: 'rgba(53,107,119,0.71)',
      borderWidth: 'min(2.31vw, 1.07vh)',
      gap: 'min(10.32vw, 1.07vh)',
      padding: 'min(10.32vw, 1.07vh)',
      backgroundColor: 'white',
      borderRadius: 'max(4.65vw, 2.15vh)',
      height: '40vh',
      width: '80vw',
      minWidth: '240px'
    }}>
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div
          key={day}
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            color: day ? '#356B77' : 'transparent',
            fontSize: 'min(3.72vw, 1.72vh)'
          }}
        >
          {day}
        </div>
      ))}

      {calendarDays.map((day, index) => {
        const isToday = day === currentDate.getDate() && 
                       currentDate.getMonth() === monthIndex && 
                       currentDate.getFullYear() === selectedYear;
        const isSelected = day === selectedDay;
        const hasWorkout = workoutDates?.has(day);

        return (
          <div
            key={index}
            onClick={() => day && onDayClick(day)}
            style={{
              position: 'relative',
              paddingTop: '0.86vh',
              paddingBottom: '0.86vh',
              backgroundColor: day ? (isSelected ? '#356B77' : '#ffffff') : 'transparent',
              textAlign: 'center',
              color: day ? (isToday ? 'red' : isSelected ? 'white' : '#356B77') : 'transparent',
              borderRadius: '50px',
              cursor: day ? 'pointer' : 'default',
              fontSize: 'min(3.72vw, 1.72vh)',
            }}
          >
            {day || ''}
            {hasWorkout && !isSelected && (
              <div style={{
                position: 'absolute',
                bottom: '2px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#5FB7CD',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;