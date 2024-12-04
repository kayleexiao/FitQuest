// App.js
import { Container, MantineProvider } from '@mantine/core';
import React, { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AddExercisePage from './pages/AddExercisePage';
import CalendarPage from './pages/CalendarPage';
import CreateExercisePage from './pages/CreateExercisePage';
import ExplorePage from './pages/ExplorePage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import NewWorkoutPage from './pages/NewWorkoutPage';
import SavedPage from './pages/SavedPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import WorkoutPage from './pages/WorkoutPage';
import { UserProvider } from "./UserContext";

function App() {
  const[isWorkoutInProgress, setIsWorkoutInProgress] = useState(false);

  return (
    <Container style={{ padding: "1rem", textAlign: "center" }}>
      <MantineProvider theme={{ colorScheme: "light" }} withGlobalStyles withNormalizeCSS>
        <UserProvider>
          <Router>
            <Routes>
              {/* Auth routes */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<LoginPage />} />

              {/* App routes */}
              <Route
                path="/*"
                element={
                  <Routes>
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/history/workout" element={<WorkoutDetailPage />} />
                    <Route path="/saved" element={<SavedPage />} />
                    <Route path="/explore/workout" element={<WorkoutPage />} />
                    <Route path="/new-workout" element={<NewWorkoutPage setIsWorkoutInProgress={setIsWorkoutInProgress} />} />
                    <Route path="/create-exercise" element={<CreateExercisePage />} />
                    <Route path="/add-exercise" element={<AddExercisePage />} />
                  </Routes>
                }
              />
            </Routes>
          </Router>
        </UserProvider>
      </MantineProvider>
    </Container>
  );
}

export default App;