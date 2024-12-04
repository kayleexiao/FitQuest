import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import { Container, TextInput, UnstyledButton, Modal } from '@mantine/core';
import { IoSearchOutline, IoFilterOutline } from 'react-icons/io5';
import { FaTrashRestore } from 'react-icons/fa';
import { BsThreeDots } from "react-icons/bs";
import { GoHistory } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import storage from '../utils/storage';

function SavedPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Recent (Latest)');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [newExercise, setNewExercise] = useState('');
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: null,
    itemToRemove: null,
    workoutIndex: null
  });
  const [deletedWorkouts, setDeletedWorkouts] = useState([]);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [workoutReplaceModal, setWorkoutReplaceModal] = useState({
    isOpen: false,
    workoutIndex: null
  });
  const navigate = useNavigate();
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  const [workouts, setWorkouts] = useState(() => {
    return storage.templates.getAll();
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedWorkouts = storage.templates.getAll();
    if (savedWorkouts.length > 0) {
      savedWorkouts.sort((a, b) => 
        new Date(b.lastDoneDate || '1900-01-01') - new Date(a.lastDoneDate || '1900-01-01')
      );
      setWorkouts(savedWorkouts);
    }
  }, []);

  useEffect(() => {
    const savedDeletedWorkouts = storage.deletedWorkouts.getAll();
    setDeletedWorkouts(savedDeletedWorkouts);
  }, []);

  useEffect(() => {
    const currentWorkout = storage.currentWorkout.get();
    setIsWorkoutActive(!!currentWorkout);
  }, []);

  const toggleItem = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleMenuClick = (e, index) => {
    e.stopPropagation();
    if (openMenu === index) {
      setOpenMenu(null);
    } else {
      setOpenMenu(index);
      setIsEditing(false);
    }
  };

  const handleRename = (e, index, item) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditingText(item.title);
    setIsEditing(true);
    setOpenMenu(null);
  };

  const handleEdit = (e, index, item) => {
    e.stopPropagation();
    setSelectedWorkout(item);
    setIsEditModalOpen(true);
    setOpenMenu(null);
  };

  const handleRemove = (e, index) => {
    e.stopPropagation();
    setConfirmationModal({
      isOpen: true,
      type: 'workout',
      itemToRemove: workouts[index],
      workoutIndex: index
    });
    setOpenMenu(null);
  };

  const handleSaveTitle = (index) => {
    if (editingText.trim()) {
      const updatedWorkouts = [...workouts];
      updatedWorkouts[index] = {
        ...updatedWorkouts[index],
        title: editingText.trim()
      };
      setWorkouts(updatedWorkouts);
      storage.templates.save(updatedWorkouts);
    }
    setEditingIndex(null);
    setIsEditing(false);
  };

  const getFilteredAndSortedItems = () => {
    let filteredItems = [...workouts];
    
    if (searchQuery) {
      filteredItems = filteredItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.exercises.some(exercise => 
          exercise.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    return filteredItems;
  };

  const handleStartWorkout = (e, index) => {
    e.stopPropagation();
    
    const currentWorkout = storage.currentWorkout.get();
    if (currentWorkout) {
      setWorkoutReplaceModal({
        isOpen: true,
        workoutIndex: index
      });
      return;
    }

    startNewWorkout(index);
  };

// Inside SavedPage.js

  const startNewWorkout = (index) => {
    const updatedWorkouts = [...workouts];
    const selectedWorkout = updatedWorkouts[index];
    updatedWorkouts[index] = {
      ...selectedWorkout,
      lastDoneDate: new Date().toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
      })
    };
    setWorkouts(updatedWorkouts);
    storage.templates.save(updatedWorkouts);
    
    // Format exercises preserving their types
    const formattedExercises = selectedWorkout.exercises.map(exercise => ({
      id: Date.now() + Math.random(),
      title: typeof exercise === 'string' ? exercise : exercise.title,
      // If it's a string, determine type from category, otherwise keep existing type
      type: typeof exercise === 'string' 
        ? (selectedWorkout.category === 'Bodyweight' 
            ? 'bodyweight' 
            : selectedWorkout.category === 'Timed' 
              ? 'timed' 
              : 'weight')
        : exercise.type,
      sets: []
    }));

    storage.currentWorkout.save(formattedExercises);
    
    navigate('/new-workout', { 
      state: { 
        workoutTemplate: {
          title: selectedWorkout.title,
          exercises: formattedExercises
        }
      }
    });
  };

  const handleSortSelection = (option) => {
    setSelectedSort(option);
    setIsFilterOpen(false);
    
    const sortedWorkouts = [...workouts];
    
    switch(option) {
      case 'Recent (Latest)':
        sortedWorkouts.sort((a, b) => 
          new Date(b.lastDoneDate || '1900-01-01') - new Date(a.lastDoneDate || '1900-01-01')
        );
        break;
      
      case 'Recent (Oldest)':
        sortedWorkouts.sort((a, b) => 
          new Date(a.lastDoneDate || '1900-01-01') - new Date(b.lastDoneDate || '1900-01-01')
        );
        break;
      
      case 'Name (A to Z)':
        sortedWorkouts.sort((a, b) => 
          a.title.localeCompare(b.title)
        );
        break;
      
      case 'Name (Z to A)':
        sortedWorkouts.sort((a, b) => 
          b.title.localeCompare(a.title)
        );
        break;
      
      default:
        break;
    }
    
    setWorkouts(sortedWorkouts);
    storage.templates.save(sortedWorkouts);
  };

  const handleRemoveExercise = (exerciseIndex) => {
    setConfirmationModal({
      isOpen: true,
      type: 'exercise',
      itemToRemove: selectedWorkout.exercises[exerciseIndex],
      workoutIndex: exerciseIndex
    });
  };

  const handleAddExercise = () => {
    if (newExercise.trim() && selectedWorkout) {
      const updatedWorkout = {
        ...selectedWorkout,
        exercises: [...selectedWorkout.exercises, newExercise.trim()]
      };
      setSelectedWorkout(updatedWorkout);
      
      const updatedWorkouts = workouts.map(workout => 
        workout.title === selectedWorkout.title ? updatedWorkout : workout
      );
      setWorkouts(updatedWorkouts);
      storage.templates.save(updatedWorkouts);
      
      setNewExercise('');
    }
  };

  const handleConfirmRemove = () => {
    if (confirmationModal.type === 'workout') {
      const updatedWorkouts = [...workouts];
      const removedWorkout = updatedWorkouts.splice(confirmationModal.workoutIndex, 1)[0];
      
      setDeletedWorkouts(prev => [{
        ...removedWorkout,
        deletedAt: new Date().toISOString()
      }, ...prev].slice(0, 10));
      
      setWorkouts(updatedWorkouts);
      
      storage.templates.save(updatedWorkouts);
      storage.deletedWorkouts.add(removedWorkout);
    } else if (confirmationModal.type === 'exercise') {
      const updatedWorkout = {
        ...selectedWorkout,
        exercises: selectedWorkout.exercises.filter((_, index) => index !== confirmationModal.workoutIndex)
      };
      setSelectedWorkout(updatedWorkout);
      
      const updatedWorkouts = workouts.map(workout => 
        workout.title === selectedWorkout.title ? updatedWorkout : workout
      );
      setWorkouts(updatedWorkouts);
      storage.templates.save(updatedWorkouts);
    }
    setConfirmationModal({ isOpen: false, type: null, itemToRemove: null, workoutIndex: null });
  };

  const handleRecoverWorkout = (workout, index) => {
    const updatedWorkouts = [...workouts, workout];
    const updatedDeletedWorkouts = deletedWorkouts.filter((_, i) => i !== index);
    
    setWorkouts(updatedWorkouts);
    setDeletedWorkouts(updatedDeletedWorkouts);
    
    storage.templates.save(updatedWorkouts);
    storage.deletedWorkouts.save(updatedDeletedWorkouts);
  };

  const filteredAndSortedItems = getFilteredAndSortedItems();

  return (
    <div style={{ position: 'relative', maxWidth: '100%', margin: 'auto' }}>
    <Container style={{ 
      padding: 0,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar isWorkoutInProgress={isWorkoutActive} />
      
      {/* Fixed Statusbar */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1, maxWidth: '100%', margin: 'auto', backgroundColor: '#fff' }}>
        <Statusbar />
      </div>

      {/* Fixed Header Section */}
      <Container
        fluid
        style={{
          position: 'fixed',
          top: 50,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          zIndex: 9997,  // Below statusbar
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
              fontSize: '3.86vh',
              color: '#356B77', 
              fontWeight: 650,
              letterSpacing: '0.1rem',
              marginRight: '10px',
              fontStyle: 'italic',
              transition: 'all 0.3s ease',
            }}>Saved</span>
          </div>
          <div />
        </Container>

        <Container 
          fluid
          style={{ 
            padding: '10px 2px',
            position: 'relative',
            display: 'flex',
            gap: '10px'
          }}
        >
          <div style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <TextInput
              placeholder="Search..."
              icon={<IoSearchOutline size={20} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              rightSection={
                <div style={{ cursor: 'pointer' }} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                  <IoFilterOutline size={20} color="#666" />
                </div>
              }
              styles={{
                input: {
                  backgroundColor: '#F0F0F0',
                  borderRadius: 20,
                  border: 'none',
                },
                root: {
                  flex: 1,
                }
              }}
            />
            {isFilterOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                zIndex: 1000,
                marginTop: '5px',
                minWidth: '150px'
              }}>
                {['Recent (Latest)', 'Recent (Oldest)', 'Name (A to Z)', 'Name (Z to A)'].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortSelection(option)}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: selectedSort === option ? '#356B77' : '#666',
                      fontWeight: selectedSort === option ? '500' : 'normal',
                      ':hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            <UnstyledButton
              onClick={() => setIsRecoveryModalOpen(true)}
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F0F0F0',
                borderRadius: '50%',
                color: '#356B77',
              }}
              title="Recover deleted workouts"
            >
              <FaTrashRestore size={16} />
            </UnstyledButton>
          </div>
        </Container>
      </Container>

      {/* Scrollable List */}
      <Container 
        fluid
        style={{ 
          padding: '0',
          marginTop: '160px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '100%',
          paddingBottom: '100px'
        }}
      >
        {filteredAndSortedItems.length > 0 ? (
          filteredAndSortedItems.map((item, index) => (
            <div key={index} style={{ 
              width: '99%',
              maxWidth: '99%',
              margin: '0 auto',
              marginBottom: openMenu === index ? '100px' : '10px'
            }}>
              <UnstyledButton
                onClick={() => toggleItem(index)}
                style={{
                  width: '100%',
                  backgroundColor: '#879DA1',
                  borderRadius: expandedItems[index] ? '25px 25px 0 0' : 25,
                  padding: '15px 12px',
                  marginBottom: expandedItems[index] ? 0 : 10,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {editingIndex === index && isEditing ? (
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Enter') {
                        handleSaveTitle(editingIndex);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid white',
                      color: 'white',
                      fontSize: 'inherit',
                      fontWeight: 500,
                      padding: '0 0 2px 0',
                      width: '50%',
                      outline: 'none'
                    }}
                  />
                ) : (
                  <span 
                    style={{ 
                      color: 'white', 
                      fontWeight: 500,
                    }}
                  >
                    {item.title}
                  </span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ 
                    color: 'white', 
                    fontSize: '0.8em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <GoHistory /> {item.lastDoneDate || 'Never'}
                  </span>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={(e) => handleMenuClick(e, index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '5px',
                        cursor: 'pointer',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <BsThreeDots size={20} />
                    </button>
                    {openMenu === index && (
                      <div 
                        ref={menuRef}
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '100%',
                          backgroundColor: 'white',
                          borderRadius: '10px',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                          zIndex: 1000,
                          minWidth: '120px',
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '5px 0',
                        }}>
                          <button
                            onClick={(e) => handleRename(e, index, item)}
                            style={{
                              padding: '8px 15px',
                              background: 'none',
                              border: 'none',
                              textAlign: 'left',
                              cursor: 'pointer',
                              color: '#356B77',
                              fontSize: '14px',
                            }}
                          >
                            Rename
                          </button>
                          <button
                            onClick={(e) => handleRemove(e, index)}
                            style={{
                              padding: '8px 15px',
                              background: 'none',
                              border: 'none',
                              textAlign: 'left',
                              cursor: 'pointer',
                              color: '#ff4444',
                              fontSize: '14px',
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </UnstyledButton>
              
              {expandedItems[index] && (
                <div 
                  onClick={() => setExpandedItems(prev => ({...prev, [index]: false}))}  // Add click handler
                  style={{
                    backgroundColor: '#879DA1',
                    borderRadius: '0 0 25px 25px',
                    padding: '15px 12px',
                    marginBottom: 10,
                    color: 'white',
                    width: '100%',
                    cursor: 'pointer'  // Optional: shows it's clickable
                  }}
                >
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0, 
                    margin: 0,
                    marginBottom: '15px'
                  }}>
                    {item.exercises.map((exercise, i) => (
                      <li key={i} style={{ padding: '8px 0' }}>
                        {typeof exercise === 'string' ? exercise : exercise.title}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={(e) => handleStartWorkout(e, index)}
                    style={{
                      width: '100%',
                      backgroundColor: '#356B77',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '12px',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    Start Workout
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666',
            fontSize: '16px',
            width: '100%'
          }}>
            No workouts found matching "{searchQuery}"
          </div>
        )}
        
        {/* Bottom Spacer */}
        <div style={{ height: '100px' }} /> {/* Adjust height as needed */}
      </Container>

      {/* Fixed Navbar Container */}
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

      <Modal
        opened={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Workout"
        size="lg"
        styles={{
          title: {
            color: '#356B77',
            fontWeight: 600,
            fontSize: '20px'
          },
          modal: {
            padding: '20px'
          },
          overlay: {
            zIndex: 10000  // Higher than other containers
          },
          inner: {
            zIndex: 10000  // Higher than other containers
          }
        }}
      >
        {selectedWorkout && (
          <div>
            <h3>{selectedWorkout.title}</h3>
            
            {/* Add Exercise Input Section */}
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <TextInput
                placeholder="Add new exercise..."
                value={newExercise}
                onChange={(e) => setNewExercise(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddExercise();
                  }
                }}
                style={{ flex: 1 }}
                styles={{
                  input: {
                    borderRadius: '8px',
                  }
                }}
              />
              <button
                onClick={handleAddExercise}
                style={{
                  backgroundColor: '#356B77',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 15px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Add
              </button>
            </div>

            {/* Existing Exercise List */}
            <ul style={{ 
              listStyle: 'none', 
              padding: 0,
              maxHeight: '400px',  // Add scrolling for long lists
              overflowY: 'auto'
            }}>
              {selectedWorkout.exercises.map((exercise, index) => (
                <li key={index} style={{ 
                  padding: '10px',
                  backgroundColor: '#f5f5f5',
                  marginBottom: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  {exercise}
                  <button
                    onClick={() => handleRemoveExercise(index)}
                    style={{
                      backgroundColor: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            
            {/* Existing Save Button */}
            <button
              onClick={() => setIsEditModalOpen(false)}
              style={{
                width: '100%',
                backgroundColor: '#356B77',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '12px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              Save Changes
            </button>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        opened={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, type: null, itemToRemove: null, workoutIndex: null })}
        title="Confirm Removal"
        size="sm"
        styles={{
          title: {
            color: '#356B77',
            fontWeight: 600,
            fontSize: '20px'
          },
          modal: {
            padding: '20px'
          },
          overlay: {
            zIndex: 10001  // Higher than edit modal
          },
          inner: {
            zIndex: 10001  // Higher than edit modal
          }
        }}
      >
        <div>
          <p style={{ marginBottom: '20px' }}>
            {confirmationModal.type === 'workout' 
              ? `Are you sure you want to remove "${confirmationModal.itemToRemove?.title}"?`
              : `Are you sure you want to remove "${confirmationModal.itemToRemove}"?`
            }
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            justifyContent: 'flex-end' 
          }}>
            <button
              onClick={() => setConfirmationModal({ isOpen: false, type: null, itemToRemove: null, workoutIndex: null })}
              style={{
                backgroundColor: '#f5f5f5',
                color: '#666',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 15px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRemove}
              style={{
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 15px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Remove
            </button>
          </div>
        </div>
      </Modal>

      {/* Recovery Modal */}
      <Modal
        opened={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
        title="Recently Deleted Workouts"
        size="lg"
        styles={{
          title: {
            color: '#356B77',
            fontWeight: 600,
            fontSize: '20px'
          },
          modal: {
            padding: '20px'
          },
          overlay: {
            zIndex: 10001
          },
          inner: {
            zIndex: 10001
          }
        }}
      >
        {deletedWorkouts.length > 0 ? (
          <div>
            {deletedWorkouts.map((workout, index) => (
              <div
                key={index}
                style={{
                  padding: '15px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '10px',
                  marginBottom: '10px'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{workout.title}</h3>
                    <small style={{ color: '#666' }}>
                      Deleted: {new Date(workout.deletedAt).toLocaleDateString()}
                    </small>
                  </div>
                  <button
                    onClick={() => handleRecoverWorkout(workout, index)}
                    style={{
                      backgroundColor: '#356B77',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 15px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Restore
                  </button>
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {workout.exercises.length} exercises
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666'
          }}>
            No recently deleted workouts
          </div>
        )}
      </Modal>

      <Modal
        opened={workoutReplaceModal.isOpen}
        onClose={() => setWorkoutReplaceModal({ isOpen: false, workoutIndex: null })}
        title="Active Workout Found"
        size="sm"
        styles={{
          title: {
            color: '#356B77',
            fontWeight: 600,
            fontSize: '20px'
          },
          modal: {
            padding: '20px'
          },
          overlay: {
            zIndex: 10001  // Higher z-index to ensure overlay appears above other elements
          },
          inner: {
            zIndex: 10001  // Higher z-index to ensure modal appears above other elements
          }
        }}
        centered
      >
        <div>
          <p style={{ marginBottom: '20px' }}>
            You have an active workout in progress. Would you like to replace it with this new workout?
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            justifyContent: 'flex-end' 
          }}>
            <button
              onClick={() => setWorkoutReplaceModal({ isOpen: false, workoutIndex: null })}
              style={{
                backgroundColor: '#f5f5f5',
                color: '#666',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 15px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                startNewWorkout(workoutReplaceModal.workoutIndex);
                setWorkoutReplaceModal({ isOpen: false, workoutIndex: null });
              }}
              style={{
                backgroundColor: '#356B77',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 15px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Replace
            </button>
          </div>
        </div>
      </Modal>

    </Container>
    </div>
  );
}

export default SavedPage;
