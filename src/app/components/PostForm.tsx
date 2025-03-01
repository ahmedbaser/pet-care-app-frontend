'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, fetchPosts, updatePost } from '../redux/slices/postSlice';
import type { AppDispatch, RootState } from '../redux/store';
import { Form,  Button, Typography, Modal, message, Select } from 'antd';
import ImageUploadComponent from './ImageUploadComponent';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';




const { Title } = Typography;

interface Post {
  _id: string;
  title: string;
  content: string;
  token: string;
  category: string;
  isPremium?: boolean;
}

interface PostFormProps {
  post?: Post;

}

const PostForm: React.FC<PostFormProps> = ({ post }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);

  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    category: post?.category || '',
    token: post?.token || '',
    imageUrl: '',
    isPremium: post?.isPremium || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      isPremium: e.target.checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
  
    if (!token) {
      console.error('Token is missing');
      return;
    }
  
    const postData = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      imageUrl: formData.imageUrl,
      token: formData.token,
      isPremium: formData.isPremium,
    };
  
    if (post) {
      try {
        await dispatch(fetchPosts()); // Ensure latest posts are fetched before updating
        await dispatch(updatePost({ id: post._id, ...postData }));
        message.success('Post updated successfully!');
      } catch (error) {
        console.error("Failed to update post:", error);
        message.error("Failed to update post.");
      }
    } else {
      dispatch(createPost({ post: postData }));
      message.success('Post created successfully!');
    }
  };
  
  const handleUploadSuccess = (imageUrl: string) => {
    setFormData((prevData) => ({ ...prevData, imageUrl }));
  };

  const handlePreview = () => {


    console.log(formData.imageUrl); 
    console.log(formData.content)

 

    Modal.info({
      title: 'Post Preview',
      content: (
        <div>
          <h2 className="text-xl font-semibold">{formData.title}</h2>
        <div
            dangerouslySetInnerHTML={{ __html: formData.content }}
            className="prose prose-lg" // Optional Tailwind class for styling
          />
          <p className="font-medium text-gray-600">
            <strong>Category:</strong> {formData.category}
          </p>
          {formData.isPremium && (
            <p className="text-yellow-500 font-bold">This is Premium Content</p>
          )}
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Post"
              style={{ maxWidth: '100%' }}
              className="mt-2"
            />
          )}
        </div>
      ),
      onOk() {},
    });
  };


  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-lg rounded-md">
      <Title level={3} className="text-center">{post ? 'Update Post' : 'Create Post'}</Title>
      <Form onSubmitCapture={handleSubmit}>
        <Form.Item label="Post Title" required className="mb-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </Form.Item>

        <Form.Item label="Post Content" required className="mb-4">
          <ReactQuill
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Enter post content"
            modules={{
              toolbar: [
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ 'align': [] }],
                ['bold', 'italic', 'underline'],
                ['link'],
                ['blockquote'],
                ['image'],
              ],
            }}
            className="rounded-md"
          />
        </Form.Item>


           <Form.Item label="Post Category" required className="mb-4">
              <Select
                value={formData.category}
                onChange={(value) => setFormData({ ...formData, category: value })}
                placeholder="Select post category"
                className="w-full rounded-md"
              >
                <Select.Option value="Tip">Tip</Select.Option>
                <Select.Option value="Story">Story</Select.Option>
                <Select.Option value="Activity">Activity</Select.Option>
                <Select.Option value="Diseases">Diseases</Select.Option>
              </Select>
         </Form.Item>
   


       <Form.Item className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isPremium}
              onChange={handleCheckboxChange}
              className="form-checkbox"
            />
            <span>Premium Content</span>
          </label>
        </Form.Item>

        <ImageUploadComponent onUploadSuccess={handleUploadSuccess} />

        <Form.Item className="mt-4 flex space-x-4">
          <Button
            onClick={handlePreview}
            className="w-full bg-blue-500 text-white hover:bg-blue-600 mb-2"
          >
            Preview
          </Button>
          <Button
            htmlType="submit"
            className="w-full bg-blue-500 text-white hover:bg-blue-600"
          >
          {post ? 'Update Post' : 'Create Post'}
     </Button>
    </Form.Item>
   </Form>
</div>
  );
};

export default PostForm;


























