// App.js
import { Container, MantineProvider } from '@mantine/core';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ExplorePage from './pages/ExplorePage';
import CalendarPage from './pages/CalendarPage';
import HistoryPage from './pages/HistoryPage';
import SavedPage from './pages/SavedPage';
import WorkoutPage from './pages/WorkoutPage';
import NewWorkoutPage from './pages/NewWorkoutPage';

function App() {
  return (
    <MantineProvider theme={{ colorScheme: 'light' }} withGlobalStyles withNormalizeCSS>
      <Router>
        <Container style={{ padding: '1rem', textAlign: 'center' }}>
          <Routes>
            <Route path="/" element={<ExplorePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/workout" element={<WorkoutPage />} />
            <Route path="/new-workout" element={<NewWorkoutPage />} />
          </Routes>
        </Container>
      </Router>
    </MantineProvider>
  );
}

export default App;
