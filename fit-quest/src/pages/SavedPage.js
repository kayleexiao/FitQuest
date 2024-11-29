import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import { Container, TextInput, UnstyledButton, Modal } from '@mantine/core';
import { IoSearchOutline, IoFilterOutline } from 'react-icons/io5';
import { FaBookmark, FaTrashRestore } from 'react-icons/fa';
import { BsThreeDots } from "react-icons/bs";
import { GoHistory } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { workoutService } from '../services/workoutService';

function SavedPage() {
  // UI State
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [openMenu, setOpenMenu] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Recent (Latest)');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [newExercise, setNewExercise] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Data State
  const [workouts, setWorkouts] = useState([]);
  const [deletedWorkouts, setDeletedWorkouts] = useState([]);

  // Modal State
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: null,
    itemToRemove: null,
    workoutIndex: null
  });
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [workoutReplaceModal, setWorkoutReplaceModal] = useState({
    isOpen: false,
    workoutIndex: null
  });

  const menuRef = useRef();
  const navigate = useNavigate();

  // Load workouts from API
  useEffect(() => {
    const loadWorkouts = async () => {
      setIsLoading(true);
      try {
        const [savedWorkouts, deletedWorkoutsList] = await Promise.all([
          workoutService.getSavedWorkouts(),
          workoutService.getDeletedWorkouts()
        ]);
        setWorkouts(savedWorkouts || []);
        setDeletedWorkouts(deletedWorkoutsList || []);
      } catch (error) {
        console.error('Error loading workouts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Workout Actions
  const handleStartWorkout = async (e, index) => {
    e.stopPropagation();
    try {
      const currentWorkout = await workoutService.getCurrentWorkout();
      if (currentWorkout) {
        setWorkoutReplaceModal({
          isOpen: true,
          workoutIndex: index
        });
        return;
      }
      startNewWorkout(index);
    } catch (error) {
      console.error('Error checking current workout:', error);
    }
  };

  const startNewWorkout = async (index) => {
    try {
      const selectedWorkout = workouts[index];
      const result = await workoutService.startWorkout(selectedWorkout._id);

      const updatedWorkout = await workoutService.updateWorkout(selectedWorkout._id, {
        ...selectedWorkout,
        lastDoneDate: new Date().toLocaleDateString()
      });

      setWorkouts(prevWorkouts => 
        prevWorkouts.map((w, i) => i === index ? updatedWorkout : w)
      );

      navigate('/new-workout', {
        state: {
          workoutTemplate: {
            title: selectedWorkout.title,
            exercises: result.exercises,
            currentWorkoutId: result._id
          }
        }
      });
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  const handleSaveTitle = async (index) => {
    if (!editingText.trim()) return;
    
    try {
      const workoutToUpdate = workouts[index];
      const updatedWorkout = await workoutService.updateWorkout(workoutToUpdate._id, {
        ...workoutToUpdate,
        title: editingText.trim()
      });

      setWorkouts(prevWorkouts => {
        const newWorkouts = [...prevWorkouts];
        newWorkouts[index] = updatedWorkout;
        return newWorkouts;
      });
    } catch (error) {
      console.error('Error updating workout title:', error);
    }

    setEditingIndex(null);
    setIsEditing(false);
  };

  const handleConfirmRemove = async () => {
    try {
      if (confirmationModal.type === 'workout') {
        const { itemToRemove, workoutIndex } = confirmationModal;
        await workoutService.deleteWorkout(itemToRemove._id);
        
        setWorkouts(prev => prev.filter((_, index) => index !== workoutIndex));
        setDeletedWorkouts(prev => [{
          ...itemToRemove,
          deletedAt: new Date().toISOString()
        }, ...prev].slice(0, 10));
      } else if (confirmationModal.type === 'exercise' && selectedWorkout) {
        const updatedExercises = selectedWorkout.exercises.filter(
          (_, index) => index !== confirmationModal.workoutIndex
        );
        
        const updatedWorkout = await workoutService.updateWorkout(selectedWorkout._id, {
          ...selectedWorkout,
          exercises: updatedExercises
        });

        setSelectedWorkout(updatedWorkout);
        setWorkouts(prev => 
          prev.map(w => w._id === selectedWorkout._id ? updatedWorkout : w)
        );
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
    
    setConfirmationModal({
      isOpen: false,
      type: null,
      itemToRemove: null,
      workoutIndex: null
    });
  };

  const handleRecoverWorkout = async (workout, index) => {
    try {
      const recoveredWorkout = await workoutService.recoverWorkout(workout._id);
      setWorkouts(prev => [...prev, recoveredWorkout]);
      setDeletedWorkouts(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error recovering workout:', error);
    }
  };

  const handleAddExercise = async () => {
    if (!newExercise.trim() || !selectedWorkout) return;
    
    try {
      const updatedWorkout = {
        ...selectedWorkout,
        exercises: [...selectedWorkout.exercises, newExercise.trim()]
      };
      
      const result = await workoutService.updateWorkout(selectedWorkout._id, updatedWorkout);
      
      setSelectedWorkout(result);
      setWorkouts(prev => 
        prev.map(w => w._id === selectedWorkout._id ? result : w)
      );
      setNewExercise('');
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  // UI Handlers
  const toggleItem = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleMenuClick = (e, index) => {
    e.stopPropagation();
    setOpenMenu(openMenu === index ? null : index);
    setIsEditing(false);
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

  const handleRemoveExercise = (exerciseIndex) => {
    setConfirmationModal({
      isOpen: true,
      type: 'exercise',
      itemToRemove: selectedWorkout.exercises[exerciseIndex],
      workoutIndex: exerciseIndex
    });
  };

  const handleSortSelection = (option) => {
    setSelectedSort(option);
    setIsFilterOpen(false);
    
    const sortedWorkouts = [...workouts];
    switch(option) {
      case 'Recent (Latest)':
        sortedWorkouts.sort((a, b) => new Date(b.lastDoneDate) - new Date(a.lastDoneDate));
        break;
      case 'Recent (Oldest)':
        sortedWorkouts.sort((a, b) => new Date(a.lastDoneDate) - new Date(b.lastDoneDate));
        break;
      case 'Name (A to Z)':
        sortedWorkouts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Name (Z to A)':
        sortedWorkouts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    setWorkouts(sortedWorkouts);
  };

  const getFilteredAndSortedItems = () => {
    if (!searchQuery) return workouts;
    
    return workouts.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.exercises.some(exercise => 
        exercise.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const filteredAndSortedItems = getFilteredAndSortedItems();

  return (
    <Container style={{ 
      padding: 0,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar style={{ 
        position: 'fixed', 
        bottom: 0, 
        
        left: 0, 
        right: 0, 
        zIndex: 9999,
        backgroundColor: 'white'
      }} />
      
      {/* Fixed Statusbar */}
      <Container
        fluid
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9998,  // Just below navbar
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
            <FaBookmark 
              size={20}
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
        {isLoading ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666',
            fontSize: '16px',
            width: '100%'
          }}>
            Loading workouts...
          </div>
        ) : filteredAndSortedItems.length > 0 ? (
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
                  backgroundColor: '#9AB7BF',
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
                            onClick={(e) => handleEdit(e, index, item)}
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
                            Edit
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
                    backgroundColor: '#9AB7BF',
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
                      <li key={i} style={{ padding: '8px 0' }}>{exercise}</li>
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
        <Navbar />
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
  );
}

export default SavedPage;
