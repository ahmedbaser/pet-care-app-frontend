"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation'; 
import { Form, Input, Button, Typography, message, Spin } from 'antd';
import api from '@/app/utils/api';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

const ResetPasswordForm: React.FC = () => {
    const [password, setPassword] = useState('');
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false); 
    const token = searchParams.get('token');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            message.error('Invalid or missing token.');
            return;
        }

        setLoading(true);
        try {
            await api.resetPassword(token, password); 
            message.success('Password reset successfully.');
            router.push('/auth/login');
        } catch {
            message.error('Error resetting password.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                }}
            >
                <Spin size="default" />
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Reset Password</Title>
            <Form onSubmitCapture={handleSubmit} layout="vertical">
                <Form.Item
                    label="New Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter your new password!' }]}
                >
                    <Input.Password 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Enter new password" 
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Reset Password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const ResetPassword: React.FC = () => {
    return (
        <Suspense fallback={<Spin size="large" style={{ display: 'block', margin: 'auto' }} />}>
            <ResetPasswordForm />
        </Suspense>
    );
};

export default ResetPassword;



