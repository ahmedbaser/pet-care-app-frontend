import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createPost, updatePost } from '../redux/slices/postSlice';

const PostForm = ({ post }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (post) {
      dispatch(updatePost({ id: post._id, ...formData }));
    } else {
      dispatch(createPost(formData));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Post Title"
        required
      />
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="Post Content"
        required
      />
      <button type="submit">
        {post ? 'Update Post' : 'Create Post'}
      </button>
    </form>
  );
};

export default PostForm;
