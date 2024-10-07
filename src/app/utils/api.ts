
// src/utils/api.ts
 const API_URL = 'http://localhost:5000/api'; // Replace with your actual backend URL

 const fetchPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

 const fetchPostById = async (id: string) => {
  const response = await fetch(`${API_URL}/posts/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  return response.json();
};

 const createPost = async (post) => {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  return response.json();
};


export default {
  fetchPosts,
  fetchPostById,
  createPost

}