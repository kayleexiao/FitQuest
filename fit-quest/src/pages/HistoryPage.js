import { Container, Group, UnstyledButton, Text } from '@mantine/core';
import Navbar from '../components/NavBar';
import Statusbar from '../components/StatusBar';

function HistoryPage() {
  const historyEntries = [
    { 
      date: '01/15/2024',
      items: [
        { title: 'Morning Workout', time: '9:00 AM' },
        { title: 'Evening Run', time: '6:30 PM' }
      ]
    },
    {
      date: '01/14/2024',
      items: [
        { title: 'Strength Training', time: '10:00 AM' },
        { title: 'Yoga Session', time: '4:00 PM' }
      ]
    }
  ];

  return (
    <div style={{ position: 'relative', maxWidth: '100%', margin: 'auto' }}>
      {/* Fixed Status Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1, maxWidth: '100%', margin: 'auto', backgroundColor: '#fff' }}>
        <Statusbar />
      </div>
      <Navbar />
      {/* Title Section */}
      <Container style={{ paddingTop: '10px', maxWidth: '100%', margin: 'auto', overflowY: 'auto' }}>
        <Group spacing={0} direction="column" align="flex-start" style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
          {/* Greeting Section */}
            <Text
              style={{
                textAlign: 'left',
                fontSize: '3.86vh',
                color: '#356B77',
                fontWeight: 650,
                margin: 0,
                padding: 0,
              }}
            >
              <i>History</i>
            </Text>
        </Group>
      </Container>
        
        {/* Scrollable List */}
        <Container 
          fluid
          style={{ 
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '100%'
          }}
        >
          {historyEntries.map((dateGroup) => (
            <div key={dateGroup.date} style={{ 
              width: '100%', 
              margin: '0 auto',
              marginBottom: '20px'
            }}>
              {/* Date Header */}
              <div style={{ 
                padding: '0px 12px', 
                color: '#356B77', 
                fontWeight: 600,
                textAlign: 'left',
                width: '100%',
                marginBottom: '15px'
              }}>
                {dateGroup.date}
              </div>
              
              {/* Items for this date */}
              {dateGroup.items.map((item, index) => (
                <UnstyledButton
                  key={`${dateGroup.date}-${index}`}
                  style={{
                    width: '100%',
                    backgroundColor: '#879DA1',
                    borderRadius: 25,
                    padding: '15px 12px',
                    marginBottom: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: 'white', fontWeight: 500 }}>{item.title}</span>
                  <button
                    style={{
                      backgroundColor: '#356B77',
                      color: 'white',
                      border: 'none',
                      borderRadius: 15,
                      padding: '5px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    See Details
                  </button>
                </UnstyledButton>
              ))}
            </div>
          ))}
        </Container>
      <Statusbar />
      </div>
  );
}

export default HistoryPage;
