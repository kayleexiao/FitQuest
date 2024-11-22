import { Container } from '@mantine/core';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';

function WorkoutPage() {
  return (
    <Container>
      <Navbar />
      <Statusbar />
    </Container>
  );
}

export default WorkoutPage;
