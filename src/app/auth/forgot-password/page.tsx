import React, { useState } from 'react';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { sendPasswordResetEmail } from '../api/auth'; // You will need to create this API

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(email); // API call
      message.success('Password reset email sent. Please check your inbox.');
    } catch (error) {
      message.error('Error sending password reset email.');
    }
  };

  return (
    <div className="forgot-password-form">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Send Reset Email</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
