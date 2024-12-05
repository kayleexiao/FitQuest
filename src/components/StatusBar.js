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
          padding: 'min(15px,1.61vh) min(20px,4.65vw)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left side: Clock */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', paddingLeft: '20px'}}>
          <Clock />
        </div>
  
        {/* Right side: Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'min(10px, 2.31vw)' }}>
          <MdOutlineSignalCellularAlt size={'2.15vh'} />
          <IoIosWifi size={'2.15vh'} />
          <BatteryIcon /> {/* Battery icon component for dynamic display */}
        </div>
      </Container>
    );
  }

export default Statusbar;
