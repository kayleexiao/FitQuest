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
          backgroundColor: 'rgba(0,0,0,0)',
          padding: '10px 20px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingRight: '20px'}}>
          <MdOutlineSignalCellularAlt size={30} />
          <IoIosWifi size={30} />
          <BatteryIcon />
        </div>
      </Container>
    );
  }

export default Statusbar;
