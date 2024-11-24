// App.js
import { Container, MantineProvider } from '@mantine/core';
import React from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ExplorePage from './pages/ExplorePage';
import CalendarPage from './pages/CalendarPage';
import HistoryPage from './pages/HistoryPage';
import SavedPage from './pages/SavedPage';
import WorkoutPage from './pages/WorkoutPage';
import NewWorkoutPage from './pages/NewWorkoutPage';
import CreateExercisePage from './pages/CreateExercisePage';
import AddExercisePage from './pages/AddExercisePage';

function App() {
  return (
    <MantineProvider theme={{ colorScheme: 'light' }} withGlobalStyles withNormalizeCSS>
      <Router>
        <Container style={{ padding: '1rem', textAlign: 'center' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/workout" element={<WorkoutPage />} />
            <Route path="/new-workout" element={<NewWorkoutPage />} />
            <Route path="/create-exercise" element={<CreateExercisePage />} />
            <Route path="/add-exercise" element={<AddExercisePage />} />

          </Routes>
        </Container>
      </Router>
    </MantineProvider>
  );
}

export default App;
