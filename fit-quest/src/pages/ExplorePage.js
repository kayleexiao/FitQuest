import React, { useState } from 'react';
import { Container, Text, Group, Card, Box } from '@mantine/core';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';

function ExplorePage() {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState('Weight Lifting');

  // Define workout panels for each tab
  const workoutPanels = {
    'Weight Lifting': [
      'Push',
      'Pull',
      'Legs',
      'Upper Body',
      'Lower Body',
      'Full Body',
      'Core',
      'Shoulders',
      'Back'
    ],
    Bodyweight: [
      'Abs',
      'Back and Biceps',
      'Legs',
      'Push-ups Variation',
      'Core Strength',
      'Full Body HIIT',
      'Calisthenics',
      'Mobility Work',
      'Bodyweight Cardio',
    ],
    Cardio: [
      'Running',
      'Cycling',
      'Rowing',
      'Jump Rope',
      'Swimming',
      'High-Intensity',
      'Stair Climbing',
      'Elliptical',
      'Power Walking',
    ],
  };

  return (
    <Box style={{ 
      height: '100vh',
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      <Container 
        size="100%"
        style={{ 
          backgroundColor: '#ffffff', 
          padding: '16px 4px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
        {/* Status bar and top navbar */}
        <Statusbar />
        <Navbar />

        {/* Fixed content wrapper */}
        <Box style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: '4px',
          paddingRight: '4px',
        }}>
          {/* Greeting Section */}
          <Box style={{ marginBottom: '16px', marginTop: '40px' }}>
            <Text
              style={{
                color: '#356B77',
                fontSize: '28px',
                fontFamily: 'ABeeZee, sans-serif',
                fontStyle: 'italic',
                fontWeight: 500,
                textAlign: 'left',
                marginBottom: '4px',
              }}
            >
              Hello User!
            </Text>
            <Text
              style={{
                color: '#356B77',
                fontSize: '16px',
                fontFamily: 'ABeeZee, sans-serif',
                fontStyle: 'italic',
                fontWeight: 400,
                textAlign: 'left',
              }}
            >
              Today is MM/DD/YYYY
            </Text>
          </Box>

          {/* Training Selection Tabs */}
          <Box
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            {['Weight Lifting', 'Bodyweight', 'Cardio'].map((tab) => (
              <Box
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Text
                  style={{
                    color: activeTab === tab ? '#5FB7CD' : '#356B77',
                    fontSize: '18px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: activeTab === tab ? 600 : 400,
                    marginBottom: '4px',
                  }}
                >
                  {tab}
                </Text>
                {activeTab === tab && (
                  <Box
                    style={{
                      height: '3px',
                      backgroundColor: '#5FB7CD',
                      borderRadius: '3px',
                      width: '100%',
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>

          {/* Workout Cards with Vertical Scroll */}
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              overflowY: 'auto',
              flex: 1,
              marginBottom: '80px',
              WebkitOverflowScrolling: 'touch',
              paddingLeft: 0,
              paddingRight: 0,
              marginLeft: '-2px',
              marginRight: '-2px',
            }}
          >
            {workoutPanels[activeTab].map((workout) => (
              <Card
                key={workout}
                shadow="sm"
                padding="md"
                radius="xl"
                style={{
                  backgroundColor: '#879DA1',
                  color: 'white',
                  flexShrink: 0,
                  padding: 0,
                  height: '120px',
                
                  width: '100%',
                  position: 'relative',
                }}
              >
                <div style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: '16px 20px',
                }}>
                  {/* Save Icon in Top Right */}
                  <Text 
                    size="xl" 
                    style={{ 
                      cursor: 'pointer', 
                      fontSize: '22px',
                      position: 'absolute',
                      top: '12px',
                      right: '20px',
                    }}
                  >
                    ☆
                  </Text>

                  {/* Workout Content */}
                  <div style={{ 
                    width: 'calc(100% - 60px)',
                    overflow: 'hidden',
                  }}>
                    <Text
                      size="lg"
                      weight={500}
                      style={{
                        marginBottom: '4px',
                        textAlign: 'left',
                        fontSize: '20px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: '24px',
                      }}
                    >
                      {workout}
                    </Text>
                    <Group spacing={4} align="center" noWrap style={{ height: '24px' }}>
                      <Text size="sm" style={{ marginRight: '8px', fontSize: '14px' }}>Difficulty</Text>
                      {[...Array(3)].map((_, i) => (
                        <Text
                          key={i}
                          style={{
                            color: i < 2 ? 'white' : 'rgba(255,255,255,0.5)',
                            fontSize: '16px',
                            lineHeight: '1',
                          }}
                        >
                          ★
                        </Text>
                      ))}
                    </Group>
                  </div>

                  {/* Arrow Icon in Bottom Right */}
                  <Text 
                    size="xl" 
                    style={{ 
                      cursor: 'pointer', 
                      fontWeight: 'bold', 
                      fontSize: '30px',
                      position: 'absolute',
                      bottom: '12px',
                      right: '20px',
                    }}
                  >
                    ›
                  </Text>
                </div>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Bottom Navigation Bar */}
        <Navbar />
      </Container>
    </Box>
  );
}

export default ExplorePage;