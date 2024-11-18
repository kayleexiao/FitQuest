import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import { Container, TextInput, UnstyledButton } from '@mantine/core';
import { IoSearchOutline, IoFilterOutline } from 'react-icons/io5';
import { FaRegBookmark } from "react-icons/fa6";
import { IoIosArrowDropright } from "react-icons/io";

function SavedPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100); // Adjust this value as needed
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const savedItems = [
    { title: 'Title', updatedDate: 'DD/MM/YYYY' },
    { title: 'Title', updatedDate: 'DD/MM/YYYY' },
    { title: 'Title', updatedDate: 'DD/MM/YYYY' },
    { title: 'Title', updatedDate: 'DD/MM/YYYY' },
    { title: 'Title', updatedDate: 'DD/MM/YYYY' },
    { title: 'Title', updatedDate: 'DD/MM/YYYY' },
  ];

  const toggleItem = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <Container style={{ 
      padding: 0,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar />
      
      {/* Fixed Statusbar */}
      <Container
        fluid
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 101,  // Higher than the header
          backgroundColor: 'white'
        }}
      >
        <Statusbar />
      </Container>

      {/* Fixed Header Section */}
      <Container
        fluid
        style={{
          position: 'fixed',
          top: 50,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          zIndex: 100,
          transition: 'all 0.3s ease',
          transform: isScrolled ? 'translateY(-50%)' : 'none',
        }}
      >
        {/* Saved Title */}
        <Container
          fluid
          style={{
            backgroundColor: 'rgba(0,0,0,0)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: isScrolled ? '40px' : '60px',
            transition: 'all 0.3s ease',
            padding: '0 2px',
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-start', 
            marginLeft: '2px'
          }}>
            <span style={{ 
              fontSize: isScrolled ? '24px' : '36px', 
              color: '#356B77', 
              fontWeight: 650, 
              marginRight: '10px',
              transition: 'all 0.3s ease',
            }}><i>Saved</i></span>
            <FaRegBookmark 
              size={isScrolled ? 20 : 30} 
              style={{ 
                color: '#356B77', 
                marginRight: '30px',
                transition: 'all 0.3s ease',
              }} 
            />
          </div>
          <div />
        </Container>

        {/* Fixed Search Bar */}
        <Container 
          fluid
          style={{ 
            padding: '5px 2px',
            backgroundColor: 'white',
          }}
        >
          <TextInput
            placeholder="Search..."
            icon={<IoSearchOutline size={20} />}
            rightSection={<IoFilterOutline size={20} color="#666" />}
            styles={{
              input: {
                backgroundColor: '#F0F0F0',
                borderRadius: 20,
                border: 'none',
              },
            }}
          />
        </Container>
      </Container>

      {/* Scrollable List */}
      <Container 
        fluid
        style={{ 
          padding: '0',
          marginTop: '140px',
          marginBottom: '80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',  // Full width
          maxWidth: '100%'  // No max-width restriction
        }}
      >
        {savedItems.map((item, index) => (
          <div key={index} style={{ 
            width: '99%',  // Increased from 97% to 99%
            maxWidth: '99%',  // Increased from 97% to 99%
            margin: '0 auto'
          }}>
            <UnstyledButton
              onClick={() => toggleItem(index)}
              style={{
                width: '100%',
                backgroundColor: '#9AB7BF',
                borderRadius: expandedItems[index] ? '25px 25px 0 0' : 25,
                padding: '15px 12px',
                marginBottom: expandedItems[index] ? 0 : 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'white', fontWeight: 500 }}>{item.title}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'white', fontSize: '0.8em' }}>
                  Updated {item.updatedDate}
                </span>
                <IoIosArrowDropright 
                  size={20} 
                  color="white"
                  style={{
                    transform: expandedItems[index] ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </div>
            </UnstyledButton>
            
            {expandedItems[index] && (
              <div style={{
                backgroundColor: '#9AB7BF',
                borderRadius: '0 0 25px 25px',
                padding: '15px 12px',
                marginBottom: 10,
                color: 'white',
                width: '100%'
              }}>
                <p>Additional information can go here...</p>
              </div>
            )}
          </div>
        ))}
      </Container>
    </Container>
  );
}

export default SavedPage;