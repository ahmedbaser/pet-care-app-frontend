"use client";

import React, { useState } from 'react';
import { message, Form, Input, Button, Typography } from 'antd';
import api from '@/app/utils/api';
import { useRouter } from 'next/navigation';



const { Title } = Typography;

type APIErrorResponse = {
  response?: {
    data?: {
      message?: string;
    }
  }
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: { email: string }) => {
    const { email } = values;
    setLoading(true); 
    try {
     const response =  await api.sendPasswordResetEmail(email);
     const resetToken = response.resetToken;
      message.success('Password reset email sent. Redirecting...');
    
      router.push(`/auth/reset-password?token=${resetToken}`); 

    } catch (error) {
      const err = error as APIErrorResponse;
      const errorMessage = err.response?.data?.message || "Error sending password email.";
      message.error(errorMessage);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Forgot Password</Title>
      <Form onFinish={handleSubmit}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
            Send Reset Email
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPassword;
