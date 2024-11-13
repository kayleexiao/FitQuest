// App.js
import { Container, MantineProvider } from '@mantine/core';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
  return (
    <MantineProvider theme={{ colorScheme: 'light' }} withGlobalStyles withNormalizeCSS>
      <Router>
        <Container style={{ padding: '2rem', textAlign: 'center' }}>
          <Routes>
            <Route path="/" element={<ExplorePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/workout" element={<WorkoutPage />} />
          </Routes>
        </Container>
      </Router>
    </MantineProvider>
  );
}

export default App;
