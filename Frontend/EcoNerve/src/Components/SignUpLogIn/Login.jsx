import React, { useContext, useState } from 'react';
import { LoginContext } from '../../Context/Login/Login'; // Adjust the path as necessary
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignUpLogIn.css';

function Login(){
  const { setIsAuthenticated } = useContext(LoginContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Simulate login process
    if (email === 'admin@example.com' && password === 'password') {
      localStorage.setItem('token', 'your-token');
      setIsAuthenticated(true);
      toast.success('Login successful');
    } else {
      toast.error('Invalid credentials');
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
};

export{Login};