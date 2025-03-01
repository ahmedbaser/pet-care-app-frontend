'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Spin } from 'antd';
import { Post } from '@/app/redux/slices/postSlice';
import api from '@/app/utils/api';
import PostForm from '@/app/components/PostForm';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { RootState } from '@/app/redux/store';



const EditPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  console.log('this is EditPostPage:', post)
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  console.log('this is EditPostpage token:', token)



  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postId = Array.isArray(id) ? id[0] : id;
        console.log('this is EditPostPage Id:', postId)
        const postData = await api.fetchPostById(postId);
        setPost(postData);
        console.log('this is EditPostPage PostData:', postData)
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        left: source === 'navbar' ? '50%' : '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
    }}>
     <Spin size='default'/>  
  </div>
    );
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
     
      <PostForm post={{...post, token: token ?? ''}}/>

    </div>
  );
};

export default EditPostPage;