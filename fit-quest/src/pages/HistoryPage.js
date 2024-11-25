import { Container, Group, UnstyledButton, Text } from '@mantine/core';
import { useState } from 'react';
import { FaRegClock } from "react-icons/fa6";
import { IoIosArrowDropright } from "react-icons/io";
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';

function HistoryPage() {
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

  const toggleItem = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div style={{ position: 'relative', maxWidth: '100%', margin: 'auto' }}>
      {/* Fixed Status Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1, maxWidth: '100%', margin: 'auto', backgroundColor: '#fff' }}>
        <Statusbar />
      </div>
      <Navbar />
      {/* Title Section */}
      <Container style={{ paddingTop: '10px', maxWidth: '100%', margin: 'auto', overflowY: 'auto' }}>
        <Group spacing={0} direction="column" align="flex-start" style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
          {/* Greeting Section */}
            <Text
              style={{
                textAlign: 'left',
                fontSize: '3.86vh',
                color: '#356B77',
                fontWeight: 650,
                margin: 0,
                padding: 0,
              }}
            >
              <i>History</i>
            </Text>
            <FaRegClock size={'3.3rem'} style={{ paddingLeft: '1rem', color: '#356B77' }} />
          </Group>
      </Container>
        
        {/* Scrollable List */}
        <Container 
          fluid
          style={{ 
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '100%'
          }}
        >
          {historyEntries.map((dateGroup) => (
            <div key={dateGroup.date} style={{ width: '100%', margin: '0 auto' }}>
              {/* Date Header */}
              <div style={{ 
                padding: '0px 12px', 
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
                        backgroundColor: '#879DA1',
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
      <Statusbar />
      </div>
  );
}

export default HistoryPage;
