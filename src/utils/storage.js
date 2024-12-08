// storageKeys.js - Constants for localStorage keys
const STORAGE_KEYS = {
  WORKOUT_TEMPLATES: 'workoutTemplates',
  WORKOUT_HISTORY: 'workoutHistory',
  CURRENT_WORKOUT: 'currentWorkout',
  RECENT_EXERCISES: 'recentExercises',
  CALENDAR_EVENTS: 'calendarEvents',
  DELETED_WORKOUTS: 'deletedWorkouts',
  EXERCISE_HISTORY: 'exerciseHistory',
  PERSONAL_RECORDS: 'personalRecords'
};

// Basic CRUD operations for localStorage
const storage = {
  // Generic get with default value
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  // Generic set with error handling
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
      return false;
    }
  },

  // Generic remove
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  },

  // Workout Template Operations
  templates: {
    getAll: () => storage.get(STORAGE_KEYS.WORKOUT_TEMPLATES, []),
    save: (templates) => storage.set(STORAGE_KEYS.WORKOUT_TEMPLATES, templates),
    add: (template) => {
      const templates = storage.templates.getAll();
      templates.push({
        ...template,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      });
      return storage.templates.save(templates);
    },
    update: (updatedTemplate) => {
      const templates = storage.templates.getAll();
      const index = templates.findIndex(t => t.title === updatedTemplate.title);
      if (index !== -1) {
        templates[index] = { ...templates[index], ...updatedTemplate };
        return storage.templates.save(templates);
      }
      return false;
    }
  },

  // Workout History Operations
  history: {
    getAll: () => storage.get(STORAGE_KEYS.WORKOUT_HISTORY, []),
    save: (history) => storage.set(STORAGE_KEYS.WORKOUT_HISTORY, history),
    add: (workout) => {
      const history = storage.history.getAll();
      const formattedWorkout = {
        ...workout,
        completedAt: new Date().toISOString(),
        exercises: workout.exercises.map(exercise => ({
          ...exercise,
          sets: exercise.sets.map(set => ({
            ...set,
            timestamp: new Date().toISOString()
          })),
          notes: exercise.notes
        }))
      };
      history.unshift(formattedWorkout);
      return storage.history.save(history);
    },
    getByDate: (date) => {
      const history = storage.history.getAll();
      return history.filter(workout => {
        const workoutDate = new Date(workout.completedAt).toDateString();
        const targetDate = new Date(date).toDateString();
        return workoutDate === targetDate;
      });
    },
    getLastWorkoutWithExercise: (exerciseTitle) => {
      const history = storage.history.getAll();
      const sortedHistory = history.sort((a, b) => 
        new Date(b.completedAt) - new Date(a.completedAt)
      );
      
      return sortedHistory.find(workout => 
        workout.exercises.some(exercise => 
          exercise.title.toLowerCase() === exerciseTitle.toLowerCase()
        )
      );
    }
  },

  // Current Workout Operations
  currentWorkout: {
    get: () => storage.get(STORAGE_KEYS.CURRENT_WORKOUT),
    save: (workout) => storage.set(STORAGE_KEYS.CURRENT_WORKOUT, workout),
    clear: () => storage.remove(STORAGE_KEYS.CURRENT_WORKOUT),
    update: (exerciseUpdates) => {
      const current = storage.currentWorkout.get() || [];
      const updated = current.map(exercise => {
        const updates = exerciseUpdates.find(u => u.id === exercise.id);
        return updates ? { ...exercise, ...updates } : exercise;
      });
      return storage.currentWorkout.save(updated);
    }
  },

  // Recent Exercises Operations
  recentExercises: {
    getAll: () => storage.get(STORAGE_KEYS.RECENT_EXERCISES, []),
    add: (exercise) => {
      const recent = storage.recentExercises.getAll();
      const exists = recent.findIndex(e => e.title === exercise.title);
      if (exists !== -1) {
        recent.splice(exists, 1);
      }
      recent.unshift(exercise);
      const limited = recent.slice(0, 10); // Keep only last 10
      return storage.set(STORAGE_KEYS.RECENT_EXERCISES, limited);
    }
  },

  // Calendar Operations
  calendar: {
    getEvents: () => storage.get(STORAGE_KEYS.CALENDAR_EVENTS, {}),
    addEvent: (date, event) => {
      const events = storage.calendar.getEvents();
      if (!events[date]) {
        events[date] = [];
      }
      events[date].push(event);
      return storage.set(STORAGE_KEYS.CALENDAR_EVENTS, events);
    },
    getEventsByDate: (date) => {
      const events = storage.calendar.getEvents();
      return events[date] || [];
    }
  },

  // Deleted Workouts Operations
  deletedWorkouts: {
    getAll: () => storage.get(STORAGE_KEYS.DELETED_WORKOUTS, []),
    add: (workout) => {
      const deleted = storage.deletedWorkouts.getAll();
      deleted.unshift({
        ...workout,
        deletedAt: new Date().toISOString()
      });
      const limited = deleted.slice(0, 10); // Keep only last 10
      return storage.set(STORAGE_KEYS.DELETED_WORKOUTS, limited);
    },
    restore: (index) => {
      const deleted = storage.deletedWorkouts.getAll();
      const [restored] = deleted.splice(index, 1);
      storage.set(STORAGE_KEYS.DELETED_WORKOUTS, deleted);
      if (restored) {
        const templates = storage.templates.getAll();
        templates.push(restored);
        storage.templates.save(templates);
        return true;
      }
      return false;
    }
  },

  // Personal Records Operations
  personalRecords: {
    getAll: () => storage.get(STORAGE_KEYS.PERSONAL_RECORDS, {}),
    
    // Get PR for specific exercise
    get: (exerciseTitle, type) => {
      const records = storage.get(STORAGE_KEYS.PERSONAL_RECORDS, {});
      return records[`${exerciseTitle}-${type}`] || null;
    },
    
    // Update PR for an exercise
    update: (exerciseTitle, type, newRecord) => {
      const records = storage.get(STORAGE_KEYS.PERSONAL_RECORDS, {});
      const key = `${exerciseTitle}-${type}`;
      const currentRecord = records[key];
      
      // For weight exercises
      if (type === 'weight') {
        if (!currentRecord || 
            newRecord.weight > currentRecord.weight || 
            (newRecord.weight === currentRecord.weight && newRecord.reps > currentRecord.reps)) {
          records[key] = {
            ...newRecord,
            date: new Date().toISOString()
          };
        }
      } 
      // For bodyweight exercises
      else if (type === 'bodyweight') {
        if (!currentRecord || newRecord.reps > currentRecord.reps) {
          records[key] = {
            ...newRecord,
            date: new Date().toISOString()
          };
        }
      }
      
      return storage.set(STORAGE_KEYS.PERSONAL_RECORDS, records);
    }
  }
};

export default storage;
export { STORAGE_KEYS };