'use client';


import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Post } from '../redux/slices/postSlice';
import api from '../utils/api';
import { Spin } from 'antd';

interface FilterOptions {
  category: string;
  isPremium: boolean | null;
}

function stripHtmlTags(content: string) {
  return content.replace(/<\/?[^>]+(>|$)/g, '');
}

const NewsFeed: React.FC = () => {
  const searchParams = useSearchParams();
  const source = searchParams.get('source');

  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: '',
    isPremium: null,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const fetchedPosts = await api.fetchPosts();
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = posts;

      if (filterOptions.category) {
        filtered = filtered.filter(post => post.category === filterOptions.category);
      }

      if (filterOptions.isPremium !== null) {
        filtered = filtered.filter(post => post.isPremium === filterOptions.isPremium);
      }

      setFilteredPosts(filtered);
    };

    applyFilters();
  }, [filterOptions, posts]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOptions(prev => ({ ...prev, category: e.target.value }));
  };

  const handlePremiumFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterOptions(prev => ({
      ...prev,
      isPremium: value === 'all' ? null : value === 'true',
    }));
  };

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: source === 'navbar' ? '50%' : '55%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
        }}
      >
        <Spin size="default" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-100 p-8 ${source === 'navbar' ? 'px-6 md:px-56' : ''}`}>
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">News Feed</h1>

      <div className="flex justify-center gap-4 mb-8">
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Category:</label>
          <select
            value={filterOptions.category}
            onChange={handleCategoryChange}
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            <option value="Tip">Tip</option>
            <option value="Story">Story</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Premium:</label>
          <select
            value={filterOptions.isPremium !== null ? filterOptions.isPremium.toString() : 'all'}
            onChange={handlePremiumFilterChange}
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All</option>
            <option value="true">Premium</option>
            <option value="false">Free</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <div
            key={post._id}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>

            {post.imageUrl ? (
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            ) : null}

            <div className="text-gray-700 mb-4">
              {post.isPremium
                ? `${stripHtmlTags(post.content).slice(0, 150)}...`
                : stripHtmlTags(post.content)}
            </div>

            <p className="text-sm font-medium text-gray-500 mb-2">Category: {post.category}</p>
            <p className={`text-sm font-medium ${post.isPremium ? 'text-red-600' : 'text-green-600'}`}>
              {post.isPremium ? 'Premium Content' : 'Free Content'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Wrap the NewsFeed component in Suspense to handle the asynchronous state and hooks.
const NewsFeedPage: React.FC = () => {
  return (
    <Suspense fallback={<Spin size="default" />}>
      <NewsFeed />
    </Suspense>
  );
};

export default NewsFeedPage;
