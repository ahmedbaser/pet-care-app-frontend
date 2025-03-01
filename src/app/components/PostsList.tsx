'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, fetchPosts } from '../redux/slices/postSlice';
import Link from 'next/link';
import { AppDispatch, RootState } from '../redux/store';
import { Card, Button, Typography, Space, Spin, Tag } from 'antd';

const { Title } = Typography;

function stripHtmlTags(content: string) {
  return content.replace(/<\/?[^>]+(>|$)/g, '');
}

function truncateContent(content: string, isPremium: boolean): string {
  if (isPremium) {
    const halfLength = Math.ceil(content.length / 2);
    return `${content.slice(0, halfLength)}...`;
  }
  return content;
}

const PostsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.post.posts);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  console.log('this is userId:', userId)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchPosts());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

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

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(id));
    }
  };

  const sortedPosts = Array.isArray(posts)
    ? [...posts].sort((a, b) => (a.content?.length || 0) - (b.content?.length || 0))
    : [];

  const LONG_CONTENT_THRESHOLD = 150;

  return (
    <div className="p-4 sm:p-5 flex flex-col items-center bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {sortedPosts.map((post) =>
          post && post.content ? (
            <div
              key={post._id}
              className={post.content.length > LONG_CONTENT_THRESHOLD ? 'col-span-full' : 'col-span-1'}
            >
              <Card
                hoverable
                className="w-full rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl bg-white"
                title={
                  <div className="flex justify-between items-center">
                    <Title level={4} className="text-gray-800 mb-2">
                      {post.title || 'Untitled'}
                    </Title>
                    {post.isPremium && <Tag color="gold">Premium</Tag>}
                  </div>
                }
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="w-full h-72 object-contain rounded-md mb-4"
                  />
                )}

                <div className="text-base text-gray-600 mb-4">
                  {truncateContent(stripHtmlTags(post.content), post.isPremium)}
                </div>

                <Space size="middle" className="flex justify-center mt-4 w-full flex-wrap">
                  <Link href={`/post/${post._id}`}>
                    <Button type="primary" className="bg-blue-600 border-blue-600 w-24 text-center">
                      View
                    </Button>
                  </Link>

                  {(userRole === 'admin' || userId === post.author?._id) && (
                    <>
                      <Link href={`/post/${post._id}/edit`}>
                        <Button className="bg-gray-500 border-gray-500 text-white w-24 text-center">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        danger
                        onClick={() => handleDelete(post._id)}
                        className="bg-red-600 border-red-600 w-24 text-center"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Space>
              </Card>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default PostsList;











