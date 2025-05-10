"use client";

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Drawer, Button } from 'antd';
import {
  MenuOutlined,
  UserOutlined,
  FormOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  AppstoreOutlined,
  HeartOutlined,
  BarChartOutlined, 
  LineChartOutlined,
  UserSwitchOutlined,
  AlertOutlined,
  BulbOutlined
} from '@ant-design/icons';
import ProfilePage from '@/app/profile/page';
import PostForm from '../components/PostForm';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/redux/store';
import { followUser } from '../redux/slices/actionsSlice';
import FollowedUsers from '../components/FollowedUsers';
import PetNutritionCalculator from '../user/PetNutritionCalculator';
import Title from 'antd/es/typography/Title';
import UserPostList from '../components/UserPostList';
import NewsFeed from '../newsFeed/page';
import dynamic from 'next/dynamic';
import ActivityAnalytics from '../components/ActivityAnalytics';
import AdoptionMatching from '../components/AdoptionMatching';
import HealthPrediction from '../components/HealthPrediction';
import PetCareRecommendation from '../components/PetCareRecommendation';
import HealthAlerts from '../components/HealthAlerts';
import BehavioralInsights from '../components/BehavioralInsights';




const Chatbot = dynamic(() => import('../components/Chatbot'), { ssr: false });

const { Header, Content, Sider } = Layout;

const UserDashboard: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('profile');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?._id);



  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  
  useEffect(() => {
    if (userId) {
      dispatch(followUser(userId));
    }
  }, [dispatch, userId]);



  const renderContent = () => {
    switch (selectedKey) {
      case 'profile':
        return <ProfilePage />;
      case 'myPosts':
        return <UserPostList />;
      case 'createPost':
        return (
          <>
           <PostForm />
           <Chatbot/>
          </>
        )
      case 'myFollowings':
        return <FollowedUsers />;
      case 'newsFeed':
        return <NewsFeed />;
      case 'petNutrition':
        return (
          <>
          <PetNutritionCalculator />
          <Chatbot/>
          </>
        )
      case 'petActivity': 
      return <ActivityAnalytics/>
      case 'petAdoptionMatch': 
      return <AdoptionMatching/>
      case 'healthPrediction': 
      return <HealthPrediction/>
      case 'petCareRecommendation': 
      return <PetCareRecommendation/>
      case 'petHealthAlerts': 
      return <HealthAlerts/>
      case 'petBehavioralInsights': 
      return <BehavioralInsights/>
      default:
        return <ProfilePage />;
    }
  };

  const menuItems = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      onSelect={({ key }) => {
        setSelectedKey(key);
        if (isMobile) setDrawerVisible(false);
      }}
      style={{ height: '100%' }}
    >
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="myPosts" icon={<UnorderedListOutlined />}>
        My Posts
      </Menu.Item>
      <Menu.Item key="createPost" icon={<FormOutlined />}>
        Create Post
      </Menu.Item>
      <Menu.Item key="myFollowings" icon={<TeamOutlined />}>
        My Followings
      </Menu.Item>
      <Menu.Item key="newsFeed" icon={<AppstoreOutlined />}>
        News Feeds
      </Menu.Item>
      <Menu.Item key="petNutrition" icon={<HeartOutlined />}>
        Pet Nutrition
      </Menu.Item>
      <Menu.Item key="petActivity" icon={<BarChartOutlined />}>
       Pet Activity Analytics
      </Menu.Item>
      <Menu.Item key="petAdoptionMatch" icon={<UserSwitchOutlined/>}>
       Pet Adoption Match
      </Menu.Item>
      <Menu.Item key="healthPrediction" icon={<LineChartOutlined/>}>
       Pet Health Prediction
      </Menu.Item>
      <Menu.Item key="petCareRecommendation" icon={<HeartOutlined/>}>
       Pet Care Recommendation
      </Menu.Item>
      <Menu.Item key="petHealthAlerts" icon={<AlertOutlined/>}>
       Pet Health Alerts
      </Menu.Item>
      <Menu.Item key="petBehavioralInsights" icon={<BulbOutlined/>}>
       Pet Behavioral Insights 
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isMobile ? (
        <>
          <Header style={{ background: '#001529', padding: '0 20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, color: 'white' }}>User Dashboard</h2>
            <Button
              type="primary"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
              style={{ borderColor: '#1890ff', color: 'white' }}
            />
          </Header>
          <Drawer
            title="User Dashboard"
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
          <Title level={3} style={{ color: '#ffffff' }}>User Dashboard</Title>
          </div>
          {menuItems}
        </Sider>
      )}
      <Layout>
        <Content style={{ margin: '24px', padding: '24px', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.40)', borderRadius: '8px' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserDashboard;

