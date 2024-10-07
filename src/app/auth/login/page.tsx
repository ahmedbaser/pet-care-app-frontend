// src/app/auth/login/page.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/slices/authSlice';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simulate authentication logic (use real API in real project)
    const user = {
      email,
      token: 'fake-jwt-token', // Replace with real JWT from your API
    };
    
    dispatch(login(user));
    router.push('/');
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
