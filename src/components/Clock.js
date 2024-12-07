import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div style={{ fontSize: 'min(15px, 1.61vh)', fontWeight: 'bold', color: 'black', textAlign: 'center' }}>
      {formattedTime}
    </div>
  );
};

export default Clock;
