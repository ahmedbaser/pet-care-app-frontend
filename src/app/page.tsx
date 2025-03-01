import React from 'react';
import PostsList from './components/PostsList';
import ClientProvider from './ClientProvider';
import Chatbot from './components/Chatbot';

const Home: React.FC = () => {
  return (
    <ClientProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col">
         <main className="flex-grow container mx-auto p-4">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Welcome to Pet Care Tips & Stories
          </h1>
          <PostsList />

         
          <Chatbot/>
    </main>
  </div>
      </ClientProvider>
  );
};

export default Home;
