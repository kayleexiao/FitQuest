import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container } from '@mantine/core';
import { MdOutlineExplore, MdAddCircleOutline, MdBookmarkBorder, MdHistory, MdOutlineCalendarMonth   } from "react-icons/md";

function Navbar() {
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
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        padding: '20px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link to="/explore" style={{ flex: 1, textAlign: 'center' }}>
        <MdOutlineExplore color={isActive('/explore') ? 'white' : '#86B0BA'} size={32} />
      </Link>
      <Link to="/new-workout" style={{ flex: 1, textAlign: 'center' }}>
        <MdAddCircleOutline color={isActive('/new-workout') ? 'white' : '#86B0BA'} size={32} />
      </Link>
      <Link to="/saved" style={{ flex: 1, textAlign: 'center' }}>
        <MdBookmarkBorder color={isActive('/saved') ? 'white' : '#86B0BA'} size={32} />
      </Link>
      <Link to="/history" style={{ flex: 1, textAlign: 'center' }}>
        <MdHistory color={isActive('/history') ? 'white' : '#86B0BA'} size={32} />
      </Link>
      <Link to="/calendar" style={{ flex: 1, textAlign: 'center' }}>
        <MdOutlineCalendarMonth color={isActive('/calendar') ? 'white' : '#86B0BA'} size={32} />
      </Link>
    </Container>
  );
}

export default Navbar;
