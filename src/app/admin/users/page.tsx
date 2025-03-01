"use client";

import { deleteUser, fetchUsers } from '@/app/redux/slices/userSlice';
import { AppDispatch, RootState } from '@/app/redux/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Tag, Space, Typography, Popconfirm, message, Spin } from 'antd';
import { DeleteOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AdminUsersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUsers());
      setLoading(false);
    }
    fetchData();
  }, [dispatch]);


  if (loading) {
    return (
    <div style={{
        position: 'fixed',
        top: '50%',
        left: '55%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
      }}>
        <Spin size="default" /> 
      </div>
    );
  }


  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      message.success("User deleted successfully");
    } catch{
      message.error("Failed to delete user");
    }
  };

  // Filter out only users who are not admins (isAdmin: false)
  const filteredUsers = users.filter(user => user.role !== 'Admin');

  return (
    <div className="container mx-auto p-8">
      <Title level={4} className="text-center mb-6">Manage Users</Title>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {filteredUsers.map((user) => (
          <Card
            key={user._id}
            bordered={false}
            className="shadow-md hover:shadow-lg transition-shadow duration-300"
            style={{
              borderRadius: '10px',
              backgroundColor: '#fafafa',
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <Space align="start" size="middle" className="flex-1">
                <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <div>
                  <Title level={4} className="text-lg lg:text-xl">{user.name}</Title>
                  <Text type="secondary" className="text-sm lg:text-base">{user.email}</Text>
                  <div className="flex mt-2 flex-wrap">
                    <Tag color={user.isActive ? "green" : "volcano"} className="mr-2 mb-2">
                      {user.isActive ? "Active" : "Inactive"}
                    </Tag>
                    <Tag color="blue" className="mb-2">{user.role}</Tag>
                  </div>
                </div>
              </Space>
              
              <Popconfirm
                title="Are you sure you want to delete this user?"
                onConfirm={() => handleDelete(user._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  className="w-full sm:w-28 lg:w-auto mt-4 lg:mt-0 lg:ml-auto md:ml-10 sm:ml-10"
                >
                  Delete User
                </Button>
              </Popconfirm>
            </div>
          </Card>
        ))}
      </Space>
    </div>
  );
};

export default AdminUsersPage;
