"use client"; 
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Typography, message } from 'antd';
import api from '@/app/utils/api';

const { Title } = Typography;

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.registerUser({ email, password, name, phone, address });
      console.log('User registered successfully:', response);
      message.success('Registration successful! Redirecting to login...');
      router.push('/auth/login'); // Redirect to login page after registration
    } catch (error) {
      console.error('Registration failed:', error);
      message.error('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Register</Title>
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your name!' }]}
        >
          <Input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter your name" 
          />
        </Form.Item>
        
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
        >
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter your email" 
          />
        </Form.Item>
       
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter your password" 
          />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: 'Please enter your phone number!' },
            { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit phone number!' }
          ]}
        >
          <Input 
            type="text" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="Enter your phone number" 
          />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please enter your address!' }]}
        >
          <Input 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            placeholder="Enter your address" 
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            style={{ width: '100%' }} 
            loading={loading}
          >
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
