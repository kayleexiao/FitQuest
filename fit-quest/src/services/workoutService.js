// services/workoutService.js
import api from '../api/axios';

export const workoutService = {
  // Current Workout Operations
  getCurrentWorkout: async () => {
    try {
      const response = await api.get('/current-workout');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  updateCurrentWorkout: async (workoutId, exerciseData) => {
    const response = await api.put(`/current-workout/${workoutId}`, exerciseData);
    return response.data;
  },

  completeWorkout: async (workoutId) => {
    const response = await api.post(`/current-workouts/complete/${workoutId}`, {
      endTime: new Date()
    });
    return response.data;
  },

  // Exercise Operations
  updateExercise: async (workoutId, exerciseIndex, exerciseData) => {
    const response = await api.put(`/current-workout/${workoutId}/exercise/${exerciseIndex}`, exerciseData);
    return response.data;
  },

  addExercise: async (workoutId, exerciseData) => {
    const response = await api.post(`/current-workout/${workoutId}/exercise`, exerciseData);
    return response.data;
  },

  removeExercise: async (workoutId, exerciseIndex) => {
    const response = await api.delete(`/current-workout/${workoutId}/exercise/${exerciseIndex}`);
    return response.data;
  },

  // Set Operations
  addSet: async (workoutId, exerciseIndex, setData) => {
    const response = await api.post(`/current-workout/${workoutId}/exercise/${exerciseIndex}/set`, setData);
    return response.data;
  },

  updateSet: async (workoutId, exerciseIndex, setIndex, setData) => {
    const response = await api.put(
      `/current-workout/${workoutId}/exercise/${exerciseIndex}/set/${setIndex}`,
      setData
    );
    return response.data;
  },

  removeSet: async (workoutId, exerciseIndex, setIndex) => {
    const response = await api.delete(
      `/current-workout/${workoutId}/exercise/${exerciseIndex}/set/${setIndex}`
    );
    return response.data;
  },

    // Get recent exercises
    getRecentExercises: async () => {
      const response = await api.get('/exercises/recent');
      return response.data;
    },
  
    // Add to recent exercises
    addRecentExercise: async (exerciseData) => {
      const response = await api.post('/exercises/recent', exerciseData);
      return response.data;
    },

};

export default workoutService;