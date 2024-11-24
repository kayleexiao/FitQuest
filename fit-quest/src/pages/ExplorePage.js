import React, { useState } from 'react';
import { Container, Text, Group, Card, Box } from '@mantine/core';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import { MdBookmark, MdBookmarkBorder, MdStar, MdStarBorder } from 'react-icons/md';


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

    // Get the current date
    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div style={{ position: 'relative', maxWidth: '100%', margin: 'auto' }}>
      {/* Fixed Status Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1, maxWidth: '100%', margin: 'auto', backgroundColor: '#fff' }}>
        <Statusbar />
      </div>
      <Container style={{ paddingBottom: '90px', paddingTop: '10px', maxWidth: '100%', margin: 'auto', overflowY: 'auto' }}>
        <Group spacing={0} direction="column" align="flex-start" style={{ marginTop: '2rem', marginBottom: '1rem', gap: 0 }}>
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
            <i>Hello User!</i>
          </Text>
          <Text
            style={{
              color: '#356B77',
              fontSize: '18px',
              fontWeight: 500,
              textAlign: 'left',
              marginBottom: '1rem',
              padding: 0,
            }}
          >
            Today is {currentDate}.
          </Text>
        </Group>

          {/* Training Selection Tabs */}
          <Box // Box for the tab buttons
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            {['Weight Lifting', 'Bodyweight', 'Cardio'].map((tab) => (
              <Box // Box for each tab
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Text // Text for the tab label
                  style={{
                    color: activeTab === tab ? '#5FB7CD' : '#356B77',
                    fontSize: '18px',
                    fontWeight: activeTab === tab ? 600 : 400,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {tab}
                </Text>
                {activeTab === tab && (
                  <Box // Underline for the active tab
                    style={{
                      height: '3px',
                      backgroundColor: '#5FB7CD',
                      borderRadius: '3px',
                      marginTop: '4px',
                      width: '100%'
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
                  <img 
                    src="/Bookmark.png"
                    alt="bookmark"
                    style={{ 
                      cursor: 'pointer',
                      position: 'absolute',
                      top: '12px',
                      right: '20px',
                      width: '24px',  // Adjust size as needed
                      height: '24px', // Adjust size as needed
    }}
  />

                  {/* Workout Content */}
                  <div style={{ 
                    width: 'calc(100% - 60px)',
                    overflow: 'hidden',
                  }}>
                    <Text
                      size="xl"
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
                    <Group justifyContent="apart" align="center" style={{ height: '24px' }}>
                      <Text color="white" size="l" style={{ textAlign: "left", marginBottom: '1rem' }}>
                        Difficulty: <MdStar color="white" /> <MdStar color="white" /> <MdStarBorder color="white" />
                      </Text>
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

        {/* Bottom Navigation Bar */}
        <Navbar />
      </Container>

    </div>
  );
}

export default ExplorePage;