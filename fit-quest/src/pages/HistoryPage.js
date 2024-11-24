import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import { Container, Stack } from '@mantine/core';
import { IoIosArrowDropright } from "react-icons/io";
import { UnstyledButton } from '@mantine/core';
import { useState } from 'react';
import { FaRegClock } from "react-icons/fa6";

function HistoryPage() {
  // Updated mock data structure
  const historyEntries = [
    { 
      date: '01/15/2024',
      items: [
        { title: 'Morning Workout', time: '9:00 AM' },
        { title: 'Evening Run', time: '6:30 PM' }
      ]
    },
    {
      date: '01/14/2024',
      items: [
        { title: 'Strength Training', time: '10:00 AM' },
        { title: 'Yoga Session', time: '4:00 PM' }
      ]
    }
  ];

  const [expandedItems, setExpandedItems] = useState({});
  const isScrolled = false;

  const toggleItem = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Container>
      <Navbar />
      <Stack spacing="md" mt="xl">
        <Container
          fluid
          style={{
            backgroundColor: 'rgba(0,0,0,0)',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            height: isScrolled ? '40px' : '60px',
            transition: 'all 0.3s ease',
            padding: '0',
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-start',
            marginLeft: '10px'
          }}>
            <span style={{ 
              fontSize: isScrolled ? '24px' : '36px', 
              color: '#356B77', 
              fontWeight: 650, 
              marginRight: '10px',
              transition: 'all 0.3s ease',
            }}><i>History</i></span>
            <FaRegClock 
              size={isScrolled ? 20 : 30} 
              style={{ 
                color: '#356B77', 
                marginRight: '30px',
                transition: 'all 0.3s ease',
              }} 
            />
          </div>
        </Container>
        
        {/* Scrollable List */}
        <Container 
          fluid
          style={{ 
            padding: '0',
            marginTop: '80px',
            marginBottom: '80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '100%'
          }}
        >
          {historyEntries.map((dateGroup) => (
            <div key={dateGroup.date} style={{ width: '99%', maxWidth: '99%', margin: '0 auto' }}>
              {/* Date Header */}
              <div style={{ 
                padding: '10px 12px', 
                color: '#356B77', 
                fontWeight: 600,
                textAlign: 'left',
                width: '100%'
              }}>
                {dateGroup.date}
              </div>
              
              {/* Items for this date */}
              {dateGroup.items.map((item, index) => {
                const itemId = `${dateGroup.date}-${index}`;
                return (
                  <div key={itemId}>
                    <UnstyledButton
                      onClick={() => toggleItem(itemId)}
                      style={{
                        width: '100%',
                        backgroundColor: '#9AB7BF',
                        borderRadius: expandedItems[itemId] ? '25px 25px 0 0' : 25,
                        padding: '15px 12px',
                        marginBottom: expandedItems[itemId] ? 0 : 10,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ color: 'white', fontWeight: 500 }}>{item.title}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: 'white', fontSize: '0.8em' }}>
                          {item.time}
                        </span>
                        <IoIosArrowDropright 
                          size={20} 
                          color="white"
                          style={{
                            transform: expandedItems[itemId] ? 'rotate(90deg)' : 'none',
                            transition: 'transform 0.3s ease'
                          }}
                        />
                      </div>
                    </UnstyledButton>
                    
                    {expandedItems[itemId] && (
                      <div style={{
                        backgroundColor: '#9AB7BF',
                        borderRadius: '0 0 25px 25px',
                        padding: '15px 12px',
                        marginBottom: 10,
                        color: 'white',
                        width: '100%'
                      }}>
                        <p>Workout details can go here...</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </Container>
      </Stack>
      <Statusbar />
    </Container>
  );
}

export default HistoryPage;
