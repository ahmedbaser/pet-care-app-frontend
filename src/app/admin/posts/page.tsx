'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Typography, Space, Spin } from 'antd';
import { AppDispatch, RootState } from '@/app/redux/store';
import { deletePost, fetchPosts, togglePublishStatus } from '@/app/redux/slices/postSlice';

const { Title } = Typography;

function stripHtmlTags(content: string) {
  return content.replace(/<\/?[^>]+(>|$)/g, "");
}

const AdminPostsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.post.posts);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const [loading, setLoading] = useState(true);

  console.log("Updated posts in state:", posts);
  console.log('this is role:', userRole);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchPosts());
      setLoading(false);
      setLoading(false);
    };
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
                title={<Title level={4} className="text-gray-800 mb-2">{post.title || 'Untitled'}</Title>}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="w-full h-72 object-contain rounded-md mb-4"
                  />
                )}

                <div className="text-base text-gray-600 mb-4">
                  {stripHtmlTags(post.content)}
                </div>

                <Space size="middle" className="flex justify-center mt-4 w-full flex-wrap">
                  <Button
                    danger
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-600 border-red-600 w-24 text-center"
                  >
                    Delete
                  </Button>
                {post.isPublished && userRole === 'admin' ? (
                     <Button className="bg-yellow-500 w-24 border-yellow-500 text-white w-24" onClick={() => dispatch(togglePublishStatus(post._id))}>
                       Unpublish
                     </Button>
                   ) : (
                     <Button className="bg-green-500 w-24  border-green-500 text-white w-24" onClick={() => dispatch(togglePublishStatus(post._id))}>
                       Publish
                     </Button>
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

export default AdminPostsPage;












