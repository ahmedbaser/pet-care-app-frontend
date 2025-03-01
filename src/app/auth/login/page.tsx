"use client";

import React from 'react';
import { useAppDispatch } from '../../redux/store';
import { useRouter } from 'next/navigation';
import { login } from '../../redux/slices/authSlice';
import { Form, Input, Button, Typography } from 'antd';

const { Title } = Typography;

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = async (values: { email: string; password: string }) => {
    dispatch(login(values));
    router.push('/'); 
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
      <Form onFinish={handleSubmit}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;






























