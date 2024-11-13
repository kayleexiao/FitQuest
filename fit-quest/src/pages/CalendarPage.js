import React, { useState } from 'react'; 
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import { Container } from '@mantine/core';
import { MdOutlineCalendarMonth } from "react-icons/md";
import MonthMenu from '../components/MonthMenu';
import YearMenu from '../components/YearMenu';

function CalendarPage() {

  const currentMonthIndex = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(
    new Date(currentYear, currentMonthIndex).toLocaleString('default', { month: 'long' })
  );
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <Container>
      <Navbar />
      <Statusbar />
      <Container
        fluid
        style={{
          position: 'fixed',
          top: 50,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginLeft: '20px' }}>
          <span style={{ fontSize: '36px', color: '#356B77', fontWeight: 650, marginRight: '30px' }}><i>Calendar</i></span>
          <MdOutlineCalendarMonth size={40} style={{ color: '#356B77' }} />
        </div>
        <div />
      </Container>
      <Container
        fluid
        style={{
          position: 'fixed',
          top: 120,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginRight: '20px' }}>
          <MonthMenu onMonthSelect={handleMonthChange} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginLeft: '20px' }}>
          <YearMenu onYearSelect={handleYearChange} />
        </div>
      </Container>
      <div style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#356B77',
          marginTop: '450px'
        }}>
          <i>{selectedMonth} ??th, {selectedYear}</i>
      </div>
    </Container>
  );
}

export default CalendarPage;
