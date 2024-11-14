import React from 'react';
import { Container } from '@mantine/core';
import { MdOutlineSignalCellularAlt } from "react-icons/md";
import { IoIosWifi } from "react-icons/io";
import Clock from './Clock';
import BatteryIcon from './BatteryIcon';

function Statusbar() {
    return (
      <Container
        fluid
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left side: Clock */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <Clock />
        </div>
  
        {/* Right side: Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MdOutlineSignalCellularAlt size={20} />
          <IoIosWifi size={20} />
          <BatteryIcon /> {/* Battery icon component for dynamic display */}
        </div>
      </Container>
    );
  }

export default Statusbar;
