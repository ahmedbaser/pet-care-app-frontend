import React from 'react';
import PostsList from '../components/PostsList';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <h1>Welcome to Pet Care Tips & Stories</h1>
      <PostsList />
    </div>
  );
};

export default Home;
