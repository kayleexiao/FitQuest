import React, { useState, useEffect, useContext } from 'react';
import { Container, Text, Group, Card, Box, Button } from '@mantine/core';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import { MdStar, MdStarBorder, MdLogout } from 'react-icons/md';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import storage from '../utils/storage';
import { UserContext } from '../UserContext';

const WORKOUT_DATA = {
  'Weight Lifting': {
    'Push': {
      title: 'Push Workout',
      difficulty: 2,
      exercises: [
        'Bench Press',
        'Overhead Press',
        'Incline Dumbbell Press',
        'Lateral Raises',
        'Tricep Extensions',
        'Push-ups'
      ]
    },
    'Pull': {
      title: 'Pull Workout',
      difficulty: 2,
      exercises: [
        'Pull-ups',
        'Barbell Rows',
        'Face Pulls',
        'Bicep Curls',
        'Lat Pulldowns',
        'Hammer Curls'
      ]
    },
    'Legs': {
      title: 'Leg Workout',
      difficulty: 3,
      exercises: [
        'Squats',
        'Lunges',
        'Deadlifts',
        'Leg Press',
        'Calf Raises',
        'Hip Thrusts'
      ]
    }
  },
  'Bodyweight': {
    'Abs': {
      title: 'Core Crusher',
      difficulty: 3,
      exercises: [
        'Plank',
        'Russian Twists',
        'Leg Raises',
        'Mountain Climbers',
        'Flutter Kicks',
        'V-Sits'
      ]
    },
    'Push-ups Variation': {
      title: 'Push-ups Variation',
      difficulty: 1,
      exercises: [
        'Diamond Push-ups',
        'Decline Push-ups',
        'Wide Push-ups',
        'Incline Push-ups',
        'Close-grip Push-ups',
        'Kneeling Push-ups'
      ]
    },
    'Full Body HIIT': {
      title: 'Full Body HIIT',
      difficulty: 4,
      exercises: [
        'Burpees',
        'Mountain Climbers',
        'Jumping Jacks',
        'High Knees',
        'Squat Jumps',
        'Burpees with Push-ups'
      ]
    }
  },
  'Timed': {
    'Running': {
      title: 'Running',
      difficulty: 3,
      exercises: [
        '5K',
        '10K',
        'Half Marathon',
        'Marathon',
        'Interval Training',
        'Hill Sprints'
      ]
    },
    'Cycling': {
      title: 'Cycling',
      difficulty: 2,
      exercises: [
        '50K',
        '100K',
        'Half Ironman',
        'Ironman',
        'Time Trial',
        'Mountain Biking'
      ]
    },
    'Jump Rope': {
      title: 'Jump Rope',
      difficulty: 2,
      exercises: [
        '30 Seconds',
        '1 Minute',
        '2 Minutes',
      ]
    }
  }
};

function ExplorePage({ isWorkoutActive }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Weight Lifting');
  const [bookmarkedWorkouts, setBookmarkedWorkouts] = useState({});

  // Load bookmarked workouts from storage on mount
  useEffect(() => {
    const savedTemplates = storage.templates.getAll();
    const bookmarkedMap = {};
    savedTemplates.forEach(template => {
      bookmarkedMap[template.title] = true;
    });
    setBookmarkedWorkouts(bookmarkedMap);
  }, []);

  const workoutPanels = {
    'Weight Lifting': [
      'Push',
      'Pull',
      'Legs',
    ],
    'Bodyweight': [
      'Abs',
      'Push-ups Variation',
      'Full Body HIIT',
    ],
    'Timed': [
      'Running',
      'Cycling',
      'Jump Rope',
    ],
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleBookmark = (e, category, workoutKey) => {
    e.stopPropagation();
    const workoutData = WORKOUT_DATA[category][workoutKey];
    const isCurrentlyBookmarked = bookmarkedWorkouts[workoutData.title];

    if (isCurrentlyBookmarked) {
      const currentTemplates = storage.templates.getAll();
      const updatedTemplates = currentTemplates.filter(template => 
        template.title !== workoutData.title
      );
      storage.templates.save(updatedTemplates);
      setBookmarkedWorkouts(prev => ({
        ...prev,
        [workoutData.title]: false
      }));
    } else {
      const templateWorkout = {
        ...workoutData,
        category: category,
        createdAt: new Date().toISOString(),
        lastUsed: null
      };
      storage.templates.add(templateWorkout);
      setBookmarkedWorkouts(prev => ({
        ...prev,
        [workoutData.title]: true
      }));
    }
  };

  const handleWorkoutClick = (category, workoutKey) => {
    const workoutData = WORKOUT_DATA[category][workoutKey];
    navigate('/explore/workout', { 
      state: { 
        workout: {
          ...workoutData,
          category // Add the category to the workout data
        }
      }
    });
  };

  const { user } = useContext(UserContext);

  return (
    <div style={{ position: 'relative', maxWidth: '100%', margin: 'auto' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1, maxWidth: '100%', margin: 'auto', backgroundColor: '#fff' }}>
        <Statusbar />
      </div>
      <Container style={{ paddingTop: '10px', maxWidth: '100%', margin: 'auto', overflowY: 'auto' }}>
        <Button
          variant="filled"
          style={{
            position: 'absolute',
            backgroundColor: '#356B77',
            color: 'white',
            fontSize: '24px',
            fontWeight: 500,
            borderRadius: '3px',
            width: '14vw',
            marginLeft: '29vw',
            marginTop: '4.5vh'
          }}
          onClick={() => navigate('/')}
        >
          <MdLogout/>
        </Button>
        <Group spacing={0} direction="column" align="flex-start" style={{ marginTop: '2rem', marginBottom: '1rem', gap: 0 }}>
          <Group align="center" style={{ gap: '10px' }}>
            <Text style={{
              textAlign: 'left',
              fontSize: '3.86vh',
              color: '#356B77',
              fontWeight: 650,
              margin: 0,
              padding: 0,
              maxWidth: '72.5vw',
              overflowX: 'scroll'
            }}>
              <i>Hello {user.firstName ? user.firstName : "User"}!</i>
            </Text>
            <Text style={{
              color: '#356B77',
              fontSize: '18px',
              fontWeight: 500,
              textAlign: 'left',
              padding: 0,
              marginTop: '5px',
            }}>
              Today is {currentDate}.
            </Text>
          </Group>
        </Group>

        <Box style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}>
          {Object.keys(workoutPanels).map((tab) => (
            <Box
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
              <Text style={{
                color: activeTab === tab ? '#5FB7CD' : '#356B77',
                fontSize: '18px',
                fontWeight: activeTab === tab ? 600 : 400,
                whiteSpace: 'nowrap',
              }}>
                {tab}
              </Text>
              {activeTab === tab && (
                <Box style={{
                  height: '3px',
                  backgroundColor: '#5FB7CD',
                  borderRadius: '3px',
                  marginTop: '4px',
                  width: '100%'
                }} />
              )}
            </Box>
          ))}
        </Box>

        <Box style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          overflowY: 'auto',
          flex: 1,
          marginBottom: '80px',
        }}>
          {workoutPanels[activeTab].map((workoutKey) => {
            const workoutData = WORKOUT_DATA[activeTab][workoutKey];
            const isBookmarked = bookmarkedWorkouts[workoutData.title];

            return (
              <Card
                key={workoutKey}
                onClick={() => handleWorkoutClick(activeTab, workoutKey)}
                style={{
                  backgroundColor: '#879DA1',
                  color: 'white',
                  flexShrink: 0,
                  padding: 0,
                  height: '120px',
                  width: '100%',
                  position: 'relative',
                  cursor: 'pointer',
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
                  {isBookmarked ? (
                    <FaBookmark 
                      style={{ 
                        cursor: 'pointer',
                        position: 'absolute',
                        top: '12px',
                        right: '20px',
                        width: '24px',
                        height: '24px',
                        color: 'white'
                      }}
                      onClick={(e) => handleBookmark(e, activeTab, workoutKey)}
                    />
                  ) : (
                    <FaRegBookmark 
                      style={{ 
                        cursor: 'pointer',
                        position: 'absolute',
                        top: '12px',
                        right: '20px',
                        width: '24px',
                        height: '24px',
                        color: 'white'
                      }}
                      onClick={(e) => handleBookmark(e, activeTab, workoutKey)}
                    />
                  )}

                  <div style={{ width: 'calc(100% - 60px)', overflow: 'hidden' }}>
                    <Text size="xl" weight={500} style={{
                      marginBottom: '4px',
                      textAlign: 'left',
                      fontSize: '20px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: '24px',
                    }}>
                      {workoutData.title}
                    </Text>
                    <Group justifyContent="apart" align="center" style={{ height: '24px' }}>
                      <Text color="white" size="l" style={{ textAlign: "left", marginBottom: '1rem' }}>
                        Difficulty: {' '}
                        {[...Array(3)].map((_, i) => (
                          i < workoutData.difficulty ? 
                            <MdStar key={i} color="white" /> : 
                            <MdStarBorder key={i} color="white" />
                        ))}
                      </Text>
                    </Group>
                  </div>

                  <Text size="xl" style={{ 
                    cursor: 'pointer', 
                    fontWeight: 'bold', 
                    fontSize: '30px',
                    position: 'absolute',
                    bottom: '12px',
                    right: '20px',
                  }}>
                    ›
                  </Text>
                </div>
              </Card>
            );
          })}
        </Box>

        <Navbar isWorkoutInProgress={isWorkoutActive} />
      </Container>
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        backgroundColor: 'white',
        zIndex: 9999,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
      }}>
        <Navbar isWorkoutInProgress={isWorkoutActive} />
      </div>
    </div>
  );
}

export default ExplorePage;