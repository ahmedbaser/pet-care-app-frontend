// src/app/post/[id]/page.tsx
import React from 'react';
import { fetchPostById } from '../../../utils/api';

const PostPage = async ({ params }) => {
  const { id } = params;
  const post = await fetchPostById(id); // Fetch post from API

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
};

export default PostPage;
