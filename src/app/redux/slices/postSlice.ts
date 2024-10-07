import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => {
  const response = await api.get('/posts');
  return response.data;
});

export const createPost = createAsyncThunk('post/createPost', async (post) => {
  const response = await api.post('/posts', post);
  return response.data;
});

export const updatePost = createAsyncThunk('post/updatePost', async (post) => {
  const response = await api.put(`/posts/${post.id}`, post);
  return response.data;
});

export const deletePost = createAsyncThunk('post/deletePost', async (id) => {
  await api.delete(`/posts/${id}`);
  return id;
});

const postSlice = createSlice({
  name: 'post',
  initialState: {
    posts: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts.push(action.payload);
    });
    builder.addCase(updatePost.fulfilled, (state, action) => {
      const index = state.posts.findIndex((post) => post._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    });
  },
});

export default postSlice.reducer;
