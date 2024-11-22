import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';
import { Container } from '@mantine/core';

function CalendarPage() {
  return (
    <Container>
      <Navbar />
      <Statusbar />
    </Container>
  );
}

export default CalendarPage;
