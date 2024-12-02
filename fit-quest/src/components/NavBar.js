import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, ActionIcon } from '@mantine/core';
import { MdOutlineExplore, MdAddCircleOutline, MdBookmarkBorder, MdHistory, MdOutlineCalendarMonth   } from "react-icons/md";

function Navbar({ isWorkoutInProgress }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <Container
      fluid
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#326B77',
        borderTopLeftRadius: 'max(4.65vw, 2.15vh)',
        borderTopRightRadius: 'max(4.65vw, 2.15vh)',
        padding: 'min(4.65vw, 2.15vh) 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 9999
      }}
    >
      <Link to="/explore" style={{ flex: 1, textAlign: 'center' }}>
        <MdOutlineExplore color={isActive('/explore') ? 'white' : '#86B0BA'} size={'3.43vh'} />
      </Link>
      <Link to="/saved" style={{ flex: 1, textAlign: 'center' }}>
        <MdBookmarkBorder color={isActive('/saved') ? 'white' : '#86B0BA'} size={'3.43vh'} />
      </Link>
      <Link to="/new-workout" style={{ flex: 1, textAlign: 'center' }}>
        <MdAddCircleOutline 
          color={isActive('/new-workout') ? 'white' : '#86B0BA'} 
          size={'4vh'} 
        />
      </Link>
      <Link to="/history" style={{ flex: 1, textAlign: 'center' }}>
        <MdHistory color={isActive('/history') ? 'white' : '#86B0BA'} size={'3.43vh'} />
      </Link>
      <Link to="/calendar" style={{ flex: 1, textAlign: 'center' }}>
        <MdOutlineCalendarMonth color={isActive('/calendar') ? 'white' : '#86B0BA'} size={'3.43vh'} />
      </Link>
    </Container>
  );
}

export default Navbar;
