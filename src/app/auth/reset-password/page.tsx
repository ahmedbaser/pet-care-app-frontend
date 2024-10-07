import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { message } from 'antd';
import { resetPassword } from '../api/auth'; // You will need to create this API

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const { token } = useParams<{ token: string }>();
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(token, password); // API call
      message.success('Password reset successfully.');
      history.push('/login');
    } catch (error) {
      message.error('Error resetting password.');
    }
  };

  return (
    <div className="reset-password-form">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
