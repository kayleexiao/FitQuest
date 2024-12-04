import { Container } from '@mantine/core';
import React, { useState, useContext } from 'react';
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import LoginRegister from '../components/LoginRegister';
import Statusbar from '../components/StatusBar';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../UserContext";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate(); 

  const toggleView = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  const validateFields = () => {
    const newErrors = {};
  
    if (!email) {
      newErrors.email = 'Missing Email';
    } else if (!isLogin) {
      const emailExists = testCredentials.some((cred) => cred.email === email);
      if (emailExists) {
        newErrors.email = 'Email already used';
      }
    }
  
    if (!password) newErrors.password = true;
  
    if (isLogin) {
      const isValidLogin = testCredentials.some(
        (cred) => cred.email === email && cred.password === password
      );
  
      if (!isValidLogin) {
        newErrors.email = 'Invalid Login';
        newErrors.password = true;
      }
    } else {
      if (!confirmPassword) newErrors.confirmPassword = true;
      if (!username) newErrors.username = true;
      if (password !== confirmPassword) newErrors.passwordMatch = true;
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleButtonClick = (e) => {
    e.preventDefault();
    if (validateFields()) {
      if (isLogin) {
        const user = testCredentials.find(
          (cred) => cred.email === email && cred.password === password
        );
        if (user) {
          setUser({ firstName: user.firstName });
          navigate('/explore');
        }
      } else {
        setUser({ firstName: username });
        navigate('/explore');
      }
    }
  };

  const testCredentials = [
    { email: 'email', password: 'password', firstName: 'Ethan' },
    { email: 'test', password: '1234', firstName: 'Tiffany' },
    { email: 'login', password: 'page', firstName: 'Leo' },
    { email: 'cardio', password: 'beginner', firstName: 'Kody' },
    { email: 'cyclist', password: 'experienced', firstName: 'Mia' },
  ];


  return (
    <Container>
      <Statusbar />
      <h1
        style={{
          color: '#356B77',
          fontSize: '7.5vh',
          fontWeight: '1000',
          margin: '0',
          marginTop: '10vh',
          letterSpacing: '0.1rem',
        }}
      >
        <i>FitQuest</i>
      </h1>
      <Container
        style={{
          width: '94.91vw',
          height: '13.38vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          position: 'absolute',
          left: '50%',
          transform: 'translate(-50%)',
        }}
      >
        <h1
          style={{
            color: 'black',
            fontSize: '3.76vh',
            fontWeight: '100vh',
            margin: '0',
            marginTop: '1.41vh',
            marginBottom: '1.41vh',
          }}
        >
          Get Started Now
        </h1>
        <span
          style={{
            fontSize: '1.41vh',
            color: 'grey',
            width: '56.5vw',
            height: '4.23vh',
            display: 'inline-block',
          }}
        >
          Create an account or log in to explore our app
        </span>
      </Container>
      <div
        style={{
          width: '92.62vw',
          height: '4.58vh',
          position: 'absolute',
          marginTop: '18vh',
          left: '50%',
          transform: 'translate(-50%)',
        }}
      >
        <LoginRegister isLogin={isLogin} toggleView={toggleView} />
      </div>

      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '25vh',
        }}
      >
        {!isLogin && (
          <>
            <label
              htmlFor="username"
              style={{
                fontSize: '1.41vh',
                width: '68.7vw',
                textAlign: 'left',
                color: 'grey',
              }}
            >
              First Name
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your first name"
              required
              style={{
                height: '5vh',
                width: '68.7vw',
                marginBottom: '1vh',
                fontSize: '1.88vh',
                border: errors.username ? '2px solid red' : '1px solid #ccc',
                borderRadius: '5px',
                paddingLeft: '15px',
              }}
            />
          </>
        )}

        <label
          htmlFor="email"
          style={{
            fontSize: '1.41vh',
            width: '68.7vw',
            textAlign: 'left',
            color: errors.email === 'Email already used' || errors.email === 'Invalid Login' ? 'red' : 'grey',
          }}
        >
          Email {errors.email === 'Email already used' && '(Email already used)'}
          {errors.email === 'Invalid Login' && '(Invalid Login)'}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={{
            height: '5vh',
            width: '68.7vw',
            marginBottom: '1vh',
            fontSize: '1.88vh',
            border: errors.email ? '2px solid red' : '1px solid #ccc',
            borderRadius: '5px',
            paddingLeft: '15px',
          }}
        />

        <label
          htmlFor="password"
          style={{
            fontSize: '1.41vh',
            width: '68.7vw',
            textAlign: 'left',
            color: 'grey',
          }}
        >
          Password
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={passwordVisible ? 'text' : 'password'}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            style={{
              height: '5vh',
              width: '68.7vw',
              marginBottom: '1vh',
              fontSize: '1.88vh',
              border: errors.password ? '2px solid red' : '1px solid #ccc',
              borderRadius: '5px',
              paddingLeft: '15px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
            }}
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <MdOutlineVisibility size={'min(2.15vh, 4.65vw)'}/> : <MdOutlineVisibilityOff size={'min(2.15vh, 4.65vw)'}/>}
          </div>
        </div>

        {!isLogin && (
          <>
            <label
                htmlFor="confirmPassword"
                style={{
                    fontSize: '1.41vh',
                    width: '68.7vw',
                    textAlign: 'left',
                    color: 'grey',
                }}
                >
                Re-enter Password {errors.passwordMatch && <span style={{ color: 'red' }}>(Passwords do not match)</span>}
            </label>
            <div style={{ position: 'relative' }} >
                <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                style={{
                    height: '5vh',
                    width: '68.7vw',
                    marginBottom: '1vh',
                    fontSize: '1.88vh',
                    border: errors.confirmPassword || errors.passwordMatch ? '2px solid red' : '1px solid #ccc',
                    borderRadius: '5px',
                    paddingLeft: '15px',
                }}
                />
                <div
                    style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    }}
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                >
                    {passwordVisible ? <MdOutlineVisibility size={'min(2.15vh, 4.65vw)'}/> : <MdOutlineVisibilityOff size={'min(2.15vh, 4.65vw)'}/>}
                </div>
            </div>
          </>
        )}

        <button
          onClick={handleButtonClick}
          style={{
            textDecoration: 'none',
            backgroundColor: 'white',
            color: '#356B77',
            width: '68.7vw',
            height: '5.87vh',
            borderRadius: '1.5vh',
            borderColor: '#356B77',
            borderStyle: 'solid',
            borderWidth: '0.35vh',
            fontSize: '2.11vh',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2vh',
            cursor: 'pointer',
          }}
        >
          <i>{isLogin ? 'Login' : 'Register'}</i>
        </button>
      </form>
    </Container>
  );
}

export default LoginPage;
