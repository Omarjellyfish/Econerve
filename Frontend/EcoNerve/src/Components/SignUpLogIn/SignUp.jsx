import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignUpLogIn.css';

function SignUp () {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [companyNameError, setCompanyNameError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = () => {
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
      toast.success(`Sign-up successful for ${companyName}`);
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
      <ToastContainer />
    </div>
  );
};

export { SignUp };
