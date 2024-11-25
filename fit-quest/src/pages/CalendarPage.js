import React, { useState } from 'react'; 
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import { Container } from '@mantine/core';
import { MdOutlineCalendarMonth } from "react-icons/md";
import MonthMenu from '../components/MonthMenu';
import YearMenu from '../components/YearMenu';
import WorkoutList from '../components/WorkoutList';
import Calendar from '../components/Calendar';

function CalendarPage() {

  const currentMonthIndex = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentDay = new Date().getDate();

  const [selectedMonth, setSelectedMonth] = useState(
    new Date(currentYear, currentMonthIndex).toLocaleString('default', { month: 'long' })
  );
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [selectedDay, setSelectedDay] = useState(currentDay);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  const [items, setItems] = useState([]);

  const addItem = () => {
    setItems([
      ...items,
      `${selectedMonth} ${selectedDay}, ${selectedYear} - Workout ${items.length + 1}`
    ]);
  };

  const removeLastItem = () => {
    setItems(items.slice(0, -1));
  };

  return (
    <Container>
      <Navbar />
      <Statusbar />
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
          <MdOutlineCalendarMonth size={'4.29vh'} style={{ color: '#356B77' }} />
        </div>
      </Container>

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

      <div style={{
        position: 'fixed',
        flexDirection: 'column',
        top: '75%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: '15vh',
        width: '80%',
        overflowY: 'auto',
        borderRadius: '10px'
      }}>
        <WorkoutList items={items} />
      </div>

      <div style={{
          position: 'fixed',
          flexDirection: 'column',
          top: '87.5%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          height: '3.21vh',
          width: '80%',
        }}>
        <button onClick={addItem} style={{ marginRight: '2.31vw', padding: 'min(2.31vw, 1.07vh)', borderRadius: '5px', backgroundColor: '#356B77', color: 'white', border: 'none', cursor: 'pointer', fontSize: 'min(2.31vw, 1.07vh)' }}>
          Add Workout (Temp)
        </button>
        <button onClick={removeLastItem} style={{ padding: 'min(2.31vw, 1.07vh)', borderRadius: '5px', backgroundColor: '#E74C3C', color: 'white', border: 'none', cursor: 'pointer', fontSize: 'min(2.31vw, 1.07vh)' }}>
          Remove Last Workout (Temp)
        </button>
      </div>

      <div style={{ marginTop: '17.17vh', display: 'flex', justifyContent: 'center', position: 'fixed', left: '50%', transform: 'translate(-50%, 0%)' }}>
        <Calendar 
          selectedMonth={selectedMonth} 
          selectedYear={selectedYear}
          selectedDay={selectedDay}
          onDayClick={handleDayChange}
        />
      </div>

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
