import React, { useState, useEffect } from 'react'; 
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import { Container, Group, Text } from '@mantine/core';
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
    <div style={{ position: 'relative', maxWidth: '100%', margin: 'auto' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1, maxWidth: '100%', margin: 'auto', backgroundColor: '#fff' }}>
        <Statusbar />
      </div>

        <Navbar />
        
        {/* Title Section */}
        <Container style={{ paddingTop: '10px', maxWidth: '100%', margin: 'auto', overflowY: 'auto' }}>
        <Group spacing={0} direction="column" align="flex-start" style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>
          <Text style={{
            textAlign: 'left',
            fontSize: '3.86vh',
            color: '#356B77',
            fontWeight: 650,
            margin: 0,
            padding: 0,
          }}>
            <i>Calendar</i>
          </Text>
        </Group>
      </Container>

      {/* Month/Year Selection */}
      <Container style={{ paddingBottom: '90px', paddingTop: '10px', maxWidth: '100%', margin: 'auto', overflowY: 'auto' }}>
        <Container
          style={{
            padding: '0 10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}
        >
          <MonthMenu onMonthSelect={handleMonthChange} />
          <YearMenu onYearSelect={handleYearChange} />
        </Container>

        {/* Calendar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '1rem'
        }}>
          <Calendar 
            selectedMonth={selectedMonth} 
            selectedYear={selectedYear}
            selectedDay={selectedDay}
            onDayClick={handleDayChange}
            workoutDates={getWorkoutDates()}
          />
        </div>

        {/* Selected Date Display */}
        <div style={{
          textAlign: 'center',
          fontSize: '2.58vh',
          fontWeight: '600',
          color: '#356B77',
          marginBottom: '1rem',
          fontStyle: 'italic'
        }}>
          {selectedMonth} {selectedDay || '??'}, {selectedYear}
        </div>

        {/* Workout List */}
        <Container style={{
          padding: '0 10px',
          marginBottom: '2rem',
          maxHeight: '16vh',
          overflowY: 'auto'
        }}>
          <WorkoutList 
            items={workouts}
            isLoading={loading}
          />
        </Container>
      </Container>

      <Navbar />
    </div>
  );
}

export default CalendarPage;