'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import {
  followUser,
  unfollowUser,
  fetchDiscoverableUsers,
  User,
  fetchFollowingList,
} from '../redux/slices/actionsSlice';
import { Input, Button, Modal, Card, Typography, Spin } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;


function stripHtmlTags(content: string) {
  return content.replace(/<\/?[^>]+(>|$)/g, '');
}

const FollowedUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.action);
  const token = useSelector((state: RootState) => state.auth.token);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    name: string;
    email: string;
    content: string;
    
  } | null>(null);
 
  const [followingList, setFollowedListUsers] = useState<User[]>([]);
  console.log("this is followedUsers in followingList section:", followingList);
  
  
  const [discoverableUsers, setDiscoverableUsers] = useState<User[]>([]);
  console.log('this is discoverableUsers ALL:', discoverableUsers);

  
  useEffect(() => {
    if (token) {
     
     dispatch(fetchFollowingList()).then((response) => {
      setFollowedListUsers(response.payload.following || (response.payload as User[]));
     });
      dispatch(fetchDiscoverableUsers()).then((response) => {
        setDiscoverableUsers(response.payload.users || (response.payload as User[]));
      });
    }
  }, [dispatch, token]);

  
  

const handleFollow = async (userId: string) => {
  if (!userId) {
    alert('Invalid user.');
    return;
  }
  try {
    const response = await dispatch(followUser(userId)).unwrap();
    if (response.success) {
      const followedUser = discoverableUsers.find((user) => user._id === userId);
      if (followedUser) {
        setFollowedListUsers([...followingList, followedUser]); // Add followed user to the list
        setDiscoverableUsers(discoverableUsers.filter((user) => user._id !== userId)); // Remove from discoverable
      }
    } else {
      alert(response.message || 'Error in following user');
    }
  } catch (error) {
    console.error('Follow error:', error);
  }
};

const handleUnfollow = async (userId: string) => {
  if (!userId) {
    alert('Invalid user.');
    return;
  }
  try {
    const response = await dispatch(unfollowUser(userId)).unwrap();
    if (response.success) {
      const unfollowedUser = followingList.find((user) => user._id === userId);
      if (unfollowedUser) {
        setFollowedListUsers(followingList.filter((user) => user._id !== userId)); // Remove unfollowed user
        setDiscoverableUsers([...discoverableUsers, unfollowedUser]); // Add to discoverable
      }
    } else {
      alert(response.message || 'Error in unfollowing user');
    }
  } catch (error) {
    console.error('Unfollow error:', error);
  }
};


  const handleOpenModal = (user: { name: string; email: string; content: string }) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

 

  const filteredFolloweingUsersList = followingList.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log('this is filteredFollowedUsers:', filteredFolloweingUsersList)


  const filteredDiscoverableUsers = discoverableUsers.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ); 

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '55%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
        }}
      >
        <Spin size="default" />
      </div>
    );
  }

  return (
    <div className="followed-users p-4">
      <Title level={3} className="text-xl font-semibold mb-4">
        Followed Users
      </Title>
      <Input
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {error && <p className="error text-red-500">{error}</p>}

      {/* Following Section */}
      <Title level={4} className="mt-4">
        Following
      </Title>
      
      <div className="space-y-4">
        {filteredFolloweingUsersList.length > 0 ? (
          console.log('this is filteredFolloweingUsersList:', filteredFolloweingUsersList),
          filteredFolloweingUsersList.map((item) => (
            <Card
              key={item._id}
              bordered
              className="rounded-lg shadow-md mb-4"
              bodyStyle={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div className="flex flex-1 flex-col justify-center mr-4">
                <Text strong className="text-lg">
                  {item.name}
                </Text>
                <Text type="secondary" className="text-sm">
                  @{item.email}
                </Text>
               <Button
                  type="link"
                  onClick={() =>
                    handleOpenModal({
                      name: item.name || 'No Name Provided',
                      email: item.email || 'No Email Provided',
                      content: stripHtmlTags(Array.isArray(item.posts) && item.posts[0]?.content || 'No Content Available'),
                    })
                  }
                  icon={<EyeOutlined />}
                  className="p-0 text-blue-600 hover:text-blue-800"
                >
                  View Content
                </Button>
              </div>
              <div className="flex-shrink-0">
                <Button
                  onClick={() => handleUnfollow(item._id || '')}
                  type="primary"
                  danger
                  className="hover:bg-red-600 hover:text-white"
                >
                  Unfollow
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p>No followed users found.</p>
        )}
    </div>

      {/* Discoverable Users Section */}
      <Title level={4} className="mt-4">
        Discoverable Users
      </Title>
      <div className="space-y-4">
        {filteredDiscoverableUsers.length > 0 ? (
          filteredDiscoverableUsers.map((user) => (
            <Card
              key={user._id}
              bordered
              className="rounded-lg shadow-md mb-4"
              bodyStyle={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div className="flex flex-1 flex-col justify-center mr-4">
                <Text strong className="text-lg">
                  {user.name}
                </Text>
                <Text type="secondary" className="text-sm">
                  @{user.email}
                </Text>
              </div>
              <div className="flex-shrink-0">
                <Button
                  onClick={() => handleFollow(user._id)}
                  type="primary"
                  className="hover:bg-blue-600 hover:text-white"
                >
                  Follow
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p>No discoverable users found.</p>
        )}
      </div>

      {/* Modal for User Content */}
      <Modal
        title="User Content"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={<Button onClick={handleCloseModal}>Close</Button>}
        bodyStyle={{ padding: '20px' }}
      >
        {selectedUser && (
          <div>
            <Text>
              <strong>Name:</strong> {selectedUser.name}
            </Text>
            <br />
            <Text>
              <strong>Email:</strong> {selectedUser.email}
            </Text>
            <br />
            <Text>
              <strong>Content:</strong> {selectedUser.content}
            </Text>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FollowedUsers;





