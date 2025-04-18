import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../Context/Login/Login'; // Adjust the path if needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignUpLogIn.css';

function Login() {
  const { setIsAuthenticated } = useContext(LoginContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken); // assuming backend returns { accessToken: "..." }
        localStorage.setItem('refreshToken',data.refreshToken); // assuming backend returns { accessToken: "..." }
        localStorage.setItem('companyName',data.companyName)
        setIsAuthenticated(true);
        toast.success('Login successful');

        // Redirect to dashboard or another protected page
        setTimeout(() => {
          navigate('/dashboard'); // Change to your target route
        }, 1500);
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="auth-window">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <ToastContainer />
    </div>
  );
}

export { Login };
