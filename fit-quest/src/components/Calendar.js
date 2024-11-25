import React from 'react';

const Calendar = ({ selectedMonth, selectedYear, selectedDay, onDayClick }) => {
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
      borderRadius: '20px',
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
        const isToday = day === currentDate.getDate() && new Date().getMonth() === monthIndex && new Date().getFullYear() === selectedYear;
        const isSelected = day === selectedDay;

        return (
          <div
            key={index}
            onClick={() => day && onDayClick(day)}
            style={{
              paddingTop: '0.86vh',
              paddingBottom: '0.86vh',
              backgroundColor: day ? (isSelected ? '#356B77' : '#ffffff') : 'transparent',
              textAlign: 'center',
              color: day ? (isToday ? 'red' : isSelected ? 'white' : '#356B77') : 'transparent',
              borderRadius: '50px',
              cursor: day ? 'pointer' : 'default',
              fontSize: 'min(3.72vw, 1.72vh)'
            }}
          >
            {day || ''}
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;
