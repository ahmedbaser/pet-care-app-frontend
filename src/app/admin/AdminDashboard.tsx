'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Drawer, Button, Typography,} from 'antd';
import {
  MenuOutlined,
  DollarCircleOutlined,
  StarOutlined,
  ProfileOutlined,
  UserOutlined,
  TeamOutlined,
  EditOutlined,
} from '@ant-design/icons';
import PremiumContentComponent from '../components/PremiumContentComponent';
import PaginatedPostsComponent from '../components/PaginatedPostsComponent';
import AdminProfilePage from './profile/page';
import AdminUsersPage from './users/page';
import AdminPostsPage from './posts/page';
import PaymentHistoryComponent from '../components/PaymentHistoryComponent';


const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const AdminDashboard: React.FC = () => {
 
  const [selectedKey, setSelectedKey] = useState<string>('adminProfile');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);




  const renderContent = () => {
    switch (selectedKey) {
      case 'adminProfile':
        return <AdminProfilePage />;
      case 'adminUsers':
        return <AdminUsersPage />;
      case 'adminPosts':
        return <AdminPostsPage />;
       case 'paymentHistory':
        return <PaymentHistoryComponent />;
      case 'premiumContent':
        return <PremiumContentComponent />;
      case 'paginatedPosts':
        return <PaginatedPostsComponent />;
      default:
        return <AdminProfilePage />;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      onSelect={({ key }) => {
        setSelectedKey(key);
        if (isMobile) setDrawerVisible(false); 
      }}
      style={{ height: '100%', fontSize: '16px' }}
    >
      <Menu.Item key="adminProfile" icon={<UserOutlined />}>Admin Profile</Menu.Item>
      <Menu.Item key="adminUsers" icon={<TeamOutlined />}>Manage Users</Menu.Item>
      <Menu.Item key="adminPosts" icon={<EditOutlined />}>Manage Posts</Menu.Item>
      <Menu.Item key="paymentHistory" icon={<DollarCircleOutlined />}>Payment History</Menu.Item>
      <Menu.Item key="premiumContent" icon={<StarOutlined />}>Premium Content</Menu.Item>
      <Menu.Item key="paginatedPosts" icon={<ProfileOutlined />}>Paginated Posts</Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isMobile ? (
        <>
          <Header
            style={{
              background: '#001529',
              padding: '0 20px',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 style={{ margin: 0, color: 'white' }}>Admin Dashboard</h2>
            <Button
              type="primary"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
              style={{ borderColor: '#1890ff', color: 'white' }}
            />
          </Header>
          <Drawer
            title="Admin Dashboard"
            placement="left"
            closable
            onClose={() => setDrawerVisible(false)}
            visible={drawerVisible}
            bodyStyle={{ padding: 0 }}
          >
            {menuItems}
          </Drawer>
        </>
      ) : (
        <Sider width={250} style={{ background: '#001529' }}>
          <div style={{ color: 'white', padding: '20px', fontSize: '1.2rem', textAlign: 'center' }}>
            <Title level={3} style={{ color: '#ffffff' }}>Admin Dashboard</Title>
          </div>
          {menuItems}
        </Sider>
      )}
      <Layout>
        <Content style={{ margin: '24px', padding: '24px', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
          {renderContent()}
        </Content>
     </Layout>
    </Layout>
    );
};

export default AdminDashboard;


















