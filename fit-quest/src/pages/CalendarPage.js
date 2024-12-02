import React, { useState, useEffect } from 'react'; 
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import { Container } from '@mantine/core';
import MonthMenu from '../components/MonthMenu';
import YearMenu from '../components/YearMenu';
import WorkoutList from '../components/WorkoutList';
import Calendar from '../components/Calendar';
import storage from '../utils/storage';

function CalendarPage() {
  const currentMonthIndex = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentDay = new Date().getDate();

  const [selectedMonth, setSelectedMonth] = useState(
    new Date(currentYear, currentMonthIndex).toLocaleString('default', { month: 'long' })
  );
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load workouts for the selected date
  useEffect(() => {
    const loadWorkoutsForDate = () => {
      // Create a proper date object for the selected date
      const monthIndex = new Date(Date.parse(`${selectedMonth} 1, 2024`)).getMonth();
      const selectedDate = new Date(selectedYear, monthIndex, selectedDay);
      selectedDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
      
      const dateString = selectedDate.toISOString();

      // Get workouts from storage for the selected date
      const allWorkouts = storage.history.getAll();
      const dateWorkouts = allWorkouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        workoutDate.setHours(0, 0, 0, 0);
        const targetDate = new Date(selectedDate);
        targetDate.setHours(0, 0, 0, 0);
        return workoutDate.getTime() === targetDate.getTime();
      });

      // Format workouts for display, ensuring proper date handling
      const formattedWorkouts = dateWorkouts.map(workout => ({
        ...workout,
        id: workout.date,
        date: dateString, // Use the properly formatted date
        time: new Date(workout.date).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      }));

      setWorkouts(formattedWorkouts);
      setLoading(false);
    };

    loadWorkoutsForDate();
  }, [selectedMonth, selectedYear, selectedDay]);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  const handleYearChange = (year) => {
    setSelectedYear(parseInt(year));
  };

  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  // Check if a particular date has workouts (for calendar highlighting)
  const getWorkoutDates = () => {
    const allWorkouts = storage.history.getAll();
    const workoutDates = new Set();
    
    allWorkouts.forEach(workout => {
      const date = new Date(workout.date);
      if (date.getMonth() === new Date(Date.parse(`${selectedMonth} 1, 2024`)).getMonth() &&
          date.getFullYear() === selectedYear) {
        workoutDates.add(date.getDate());
      }
    });
    
    return workoutDates;
  };

  return (
    <Container>
      <Navbar />
      <Statusbar />
      {/* Title */}
      <Container
        fluid
        style={{
          position: 'fixed',
          top: '5.36vh',
          left: 0, 
          backgroundColor: 'rgba(0,0,0,0)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 10vw',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <span style={{ fontSize: '3.86vh', color: '#356B77', fontWeight: 650, marginRight: '1vw' }}>
            <i>Calendar</i>
          </span>
        </div>
      </Container>

      {/* Selected Date Display */}
      <div style={{
        position: 'fixed',
        top: '65vh',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '2.58vh',
        fontWeight: '600',
        color: '#356B77',
        textAlign: 'center',
        width: '100%',
      }}>
        <i>{selectedMonth} {selectedDay || '??'}, {selectedYear}</i>
      </div>

      {/* Workout List */}
      <div style={{
        position: 'fixed',
        flexDirection: 'column',
        top: '75vh',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: '15vh',
        width: '80%',
        overflowY: 'auto',
        borderRadius: '10px'
      }}>
        <WorkoutList 
          items={workouts} // Pass the full workout objects instead of just formatted strings
          isLoading={loading}
        />
      </div>

      {/* Calendar */}
      <div style={{ marginTop: '18vh', display: 'flex', justifyContent: 'center', position: 'fixed', left: '50%', transform: 'translate(-50%, 0%)' }}>
        <Calendar 
          selectedMonth={selectedMonth} 
          selectedYear={selectedYear}
          selectedDay={selectedDay}
          onDayClick={handleDayChange}
          workoutDates={getWorkoutDates()}
        />
      </div>

      {/* Month/Year Selection */}
      <Container
        fluid
        style={{
          position: 'fixed',
          top: '12.88vh',
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 10vw',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MonthMenu onMonthSelect={handleMonthChange} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <YearMenu onYearSelect={handleYearChange} />
        </div>
      </Container>
    </Container>
  );
}

export default CalendarPage;