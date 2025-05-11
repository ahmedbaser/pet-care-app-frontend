import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { RootState } from '../store';

export interface Post {
   _id: string;  
  title: string;
  content: string;
  upvotes?: number;  
  downvotes?: number;
  author: {
   _id: string,
  };
  category: string;
  isPremium: boolean;
  previewContent: string;
  comments: string;
  imageUrl?: string;
  isPublished?: boolean;
  
}


interface CreatePostPayload {
  title: string;
  content: string;
  category: string;
  token: string;
  imageUrl?: string;
  isPremium?: boolean;
}

export interface UpdatePostPayload {
  id: string;  
  title: string;
  content: string;
  token?: string
  category?: string;  
  isPremium?: boolean;  
  upvotes?: number; 
  downvotes?: number;
  imageUrl?: string; 
}


// Thunks
export const fetchPosts = createAsyncThunk<Post[]>('posts/fetchPosts', async () => {
  const posts = await api.fetchPosts();
  console.log('this is the Posts:', posts)
  return posts;
});

export const fetchPostByAuthorId = createAsyncThunk<Post[], string>('posts/fetchPostByAuthorId', async (authorId) => {
   const posts = await api.fetchPostByAuthorId(authorId);
   return posts;
})


export const createPost = createAsyncThunk('post/createPost', async ({ post }: { post: CreatePostPayload }, { getState }) => {
  const token = (getState() as RootState).auth.token;
  if (!token) {
    throw new Error('No authentication token available.'); 
  }
  const response = await api.createPost(post, token);
  return response;
});




export const updatePost = createAsyncThunk('post/updatePost', async (post: UpdatePostPayload, {getState}) => {
  const token = (getState() as RootState).auth.token;
  if(!token) {
    throw new Error('No authentication token available.');
  }
  const response = await api.updatePost(`posts/${post.id}`, post, token);
  console.log('this is response of updatePost:', response)
  return response;
});



export const upvotePost = createAsyncThunk(
  'post/upvotePost',
  async (id: string, { getState }) => {
    const state = getState() as RootState;  
    const token = state.auth.token;  

    if (!token) {
      throw new Error('No authentication token available.');
    }

    const response = await api.upvotePost(id, token);  
    return response;
  }
);

export const deletePostAdmin = createAsyncThunk<void, string, { state: RootState }>(
  'post/deletePost',
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token; 

    if (!token) {
      return rejectWithValue('No authentication token available.');
    }

    await api.deletePostAdmin(id, token);
  }
);



export const togglePublishStatus = createAsyncThunk(
  'posts/togglePublishStatus',
  async (postId: string, {getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) {
      return rejectWithValue('No authentication token available.');
    }

    try {
      const response = await api.updatePostStatus(postId, token);
      console.log("API response:", response);

      if (response._id) {
        return response; 
      } else {
        return rejectWithValue("Invalid response from API"); 
      }
    } catch (error) {
      if(error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An error occurred");
    }
  }
);


export const downvotePost = createAsyncThunk(
  'post/downvotePost',
  async (id: string, { getState }) => {
    const state = getState() as RootState;  
    const token = state.auth.token; 

    if (!token) {
      throw new Error('No authentication token available.');
    }

    const response = await api.downvotePost(id, token);  
    return response;
  }
);

export const deletePost = createAsyncThunk<string, string>('posts/deletePost', async (id, {getState}) => {
  const token = (getState() as RootState).auth.token; 
  if(!token) {
    throw new Error('No authentication token available.');
  }
  await api.delete(id, token);
  return id;
});


// Slice
const postSlice = createSlice({
  name: 'post',
  initialState: {
    posts: [] as Post[],
    isLoading: false,  
    status: '',       
    error: null as string | null,  
  },
  reducers: {
   
  },
  extraReducers: (builder) => {
   
    builder.addCase(fetchPosts.pending, (state) => {
      state.isLoading = true; 
    })
   .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Array<Post>>) => {
      state.isLoading = false;
      state.posts = action.payload.map((post) => ({
        ...post,
        isPublished: post.isPublished ?? false, // Fallback if `isPublished` is undefined
      }));
    })
    .addCase(fetchPosts.rejected, (state) => {
      state.isLoading = false; 
    });
    builder.addCase(fetchPostByAuthorId.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchPostByAuthorId.fulfilled, (state, action: PayloadAction<Post[]>) => {
      state.isLoading = false;
      state.posts = action.payload;
    })
    .addCase(fetchPostByAuthorId.rejected, (state, action) => {
      state.isLoading =  false;
      state.error = action.payload as string;
    })

    builder.addCase(createPost.fulfilled, (state, action) => {
     state.posts.push(action.payload);
    })
    .addCase(createPost.rejected, (state, action) => {
      state.error = action.payload as string | null;
      console.log('this is cerate post section error:', state.error)
    })
    

    builder.addCase(updatePost.fulfilled, (state, action) => {
      console.log('this is postSlice updatePost:', action.payload)
      console.log('Current Redux Posts Before Update:', state.posts.map(p => p._id));

      const index = state.posts.findIndex((post) => post._id === action.payload._id);
      console.log('Index found:', index, 'Post ID:', action.payload._id);

      if (index !== -1) {
        console.log('Updating post in Redux state');
        state.posts[index] = action.payload;
      } else {
        console.warn('Post not found in Redux state, cannot update');
      }
    });


    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    });
    builder.addCase(upvotePost.fulfilled, (state, action) => {
      const post = state.posts.find((post) => post._id === action.meta.arg);
      if (post) {
        post.upvotes = (post.upvotes || 0) + 1;
      }
    });
    builder.addCase(downvotePost.fulfilled, (state, action) => {
      const post = state.posts.find((post) => post._id === action.meta.arg);
      if (post) {
        post.downvotes = (post.downvotes || 0) + 1;
      }
    });
    builder.addCase(deletePostAdmin.fulfilled, (state, action) => {
      state.posts = state.posts.filter(post => post._id !== action.meta.arg); 
    });

  
    builder.addCase(togglePublishStatus.fulfilled, (state, action) => {
      const updatedPost = action.payload;
      console.log('Updated post from API:', updatedPost);

      if (updatedPost && updatedPost._id) {
        const postIndex = state.posts.findIndex((post) => post._id === updatedPost._id);
        if (postIndex !== -1) {
          state.posts[postIndex] = updatedPost;
          console.log("Updated post status in state:", state.posts[postIndex]);
        } else {
          console.error("Post ID not found in state:", updatedPost._id);
        }
      } else {
        console.error("Unexpected API response:", action.payload);
      }
    })
    .addCase(togglePublishStatus.rejected, (state, action) => {
      const errorMessage = action.payload ? String(action.payload) : (action.error.message || "An unknown error occurred");
      console.error("Failed to update post status:", errorMessage);
      state.error = errorMessage;
    })
    .addCase(togglePublishStatus.pending, (state) => {
      state.status = 'loading';
    });
  },
});



export default postSlice.reducer;










