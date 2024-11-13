import React, { useState } from 'react';
import { IoIosArrowDropdown } from 'react-icons/io';

const YearMenu = ({ onYearSelect }) => {
    const years = ['2020', '2021', '2022', '2023', '2024'];
    const currentYear = new Date().getFullYear().toString();
    const [selectedYear, setSelectedYear] = useState(
      years.includes(currentYear) ? currentYear : years[0]
    );
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        onYearSelect(year); // Call the callback to update the selected year in CalendarPage
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
                minWidth: '153.5px',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'white'
            }}>
                {selectedYear}
                <IoIosArrowDropdown 
                    style={{
                        marginLeft: '10px',
                        fontSize: '20px',
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
                    {years.map((year) => (
                        <div
                            key={year}
                            onClick={() => handleYearSelect(year)}
                            style={{
                                position: 'relative',
                                padding: '8px 12px 8px 20px',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                color: '#356B77',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '15.6px',
                                backgroundColor: year === selectedYear ? 'rgba(0,0,0,0.05)' : 'transparent',
                            }}
                        >
                            {year === selectedYear && (
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
                            {year}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default YearMenu;
