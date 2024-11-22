import React from 'react';

function LoginRegister({ isLogin, toggleView }) {
  return (
    <div
      style={{
        width: '92.62vw',
        height: '4.23vh',
        backgroundColor: '#EBEBEB',
        borderRadius: 'min(2.54vw, 1.17vh)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        padding: '0.2vh',
      }}
      onClick={toggleView}
    >
      <div
        style={{
          width: '50%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2vh',
          color: isLogin ? 'white' : '#909090',
          transition: 'color 0.3s ease-in-out',
          position: 'absolute',
          left: '0',
        }}
      >
        Login
      </div>

      <div
        style={{
          width: '50%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2vh',
          color: !isLogin ? 'white' : '#909090',
          transition: 'color 0.3s ease-in-out',
          position: 'absolute',
          right: '0',
        }}
      >
        Register
      </div>

      <div
        style={{
          width: '45%',
          height: '80%',
          backgroundColor: 'white',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2vh',
          fontWeight: 'bold',
          color: 'black',
          transition: 'all 0.3s ease-in-out',
          transform: isLogin ? 'translateX(2%)' : 'translateX(120%)',
        }}
      >
        {isLogin ? 'Login' : 'Register'}
      </div>
    </div>
  );
}

export default LoginRegister;
