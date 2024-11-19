import React from 'react';

const Calendar = ({ selectedMonth, selectedYear, selectedDay, onDayClick }) => {
  const currentDate = new Date(); // Reference today's date
  const monthIndex = new Date(`${selectedMonth} 1, ${selectedYear}`).getMonth();
  const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate(); // Days in selected month
  const firstDayIndex = new Date(selectedYear, monthIndex, 1).getDay(); // Day of the week (0 = Sunday)

  // Generate days array for the current month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Add empty slots for days before the first day of the month
  const emptySlots = Array.from({ length: firstDayIndex }, (_, i) => null);

  // Combine empty slots and days
  const calendarDays = [...emptySlots, ...days];

  while (calendarDays.length < 42) {
    calendarDays.push(null); // Append empty slots to make the total 42
  }

  // Calculate the number of rows (weeks) needed for the calendar
  const rows = Math.ceil(calendarDays.length / 7); // Divide by 7 to get the number of weeks

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      borderStyle: 'solid',
      borderColor: 'rgba(53,107,119,0.71)',
      borderWidth: '10px',
      gap: '10px',
      padding: '10px',
      backgroundColor: 'white',
      borderRadius: '20px',
      height: '40vh',
      width: '80vw'
    }}>
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div
          key={day}
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            color: day ? '#356B77' : 'transparent',
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
              padding: '8px',
              backgroundColor: day ? (isSelected ? '#356B77' : '#ffffff') : 'transparent',
              textAlign: 'center',
              color: day ? (isToday ? 'red' : isSelected ? 'white' : '#356B77') : 'transparent',
              borderRadius: '30px',
              cursor: day ? 'pointer' : 'default',
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
