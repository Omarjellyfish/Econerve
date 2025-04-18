import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // for navigation
import 'react-toastify/dist/ReactToastify.css';
import './SignUpLogIn.css';

function SignUp () {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [companyNameError, setCompanyNameError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // new

  const navigate = useNavigate(); // hook from react-router-dom

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = async () => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters long and include a number and a special character');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (companyName.trim() === '') {
      setCompanyNameError('Company name is required');
      valid = false;
    } else {
      setCompanyNameError('');
    }

    if (valid) {
      try {
        const response = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, companyName }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(`Sign-up successful for ${companyName}`);
          setRegistrationSuccess(true); // show redirect button
          // Optionally clear inputs
          setEmail('');
          setPassword('');
          setCompanyName('');
        } else {
          toast.error(data.message || 'Registration failed');
        }
      } catch (error) {
        toast.error('An error occurred. Please try again.');
        console.error(error);
      }
    }
  };

  return (
    <div className="auth-window">
      <h2>Sign Up</h2>

      <input
        type="text"
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />
      {companyNameError && <div className="error-message">{companyNameError}</div>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {emailError && <div className="error-message">{emailError}</div>}

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {passwordError && <div className="error-message">{passwordError}</div>}

      <button onClick={handleSignUp}>Sign Up</button>

      {registrationSuccess && (
        <div className="after-success">
          <p className="success-message">Registration complete!</p>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export { SignUp };
