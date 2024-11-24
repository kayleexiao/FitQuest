import React, { useState } from 'react';
import { IoIosArrowDropdown } from 'react-icons/io';

const MonthMenu = ({ onMonthSelect }) => {  // Accept the callback as a prop
  const currentMonthIndex = new Date().getMonth();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    onMonthSelect(month);  // Update the parent component with the selected month
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={toggleDropdown} style={{
        padding: '10px 20px',
        borderRadius: '25px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#356B77',
        height: '5vh',
        width: '35vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        fontSize: '1.72vh'
      }}>
        {selectedMonth}
        <IoIosArrowDropdown 
          style={{
            marginLeft: '10px',
            fontSize: '2.15vh',
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }} 
        />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 1000
        }}>
          {months.map((month) => (
            <div
              key={month}
              onClick={() => handleMonthSelect(month)}
              style={{
                position: 'relative',
                padding: '8px 12px 8px 20px',
                cursor: 'pointer',
                borderRadius: '4px',
                color: '#356B77',
                display: 'flex',
                alignItems: 'center',
                fontSize: '1.72vh',
                backgroundColor: month === selectedMonth ? 'rgba(0,0,0,0.05)' : 'transparent'
              }}
            >
              {month === selectedMonth && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  backgroundColor: '#356B77',
                  borderRadius: '0 4px 4px 0',
                }} />
              )}
              {month}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MonthMenu;
