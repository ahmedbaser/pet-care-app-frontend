import api from '@/app/utils/api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';




// Async Thunks
export const makePayment = createAsyncThunk(
  'payment/makePayment',
  async ({ postId,userId }: { postId: string, userId: string }, thunkAPI) => {
    try {
      const response = await api.makePayment(postId, userId);
      console.log('this is response postId:', postId)
      console.log('this is response userId:', userId)
      return response; 
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message || 'Unknown error');
    }
  }
);


export const fetchPaymentHistory = createAsyncThunk(
  'paymentHistory/fetch',
  async ({ token, postId }: { token: string; postId: string | null }, thunkAPI) => {
    try {
      const response = await api.fetchPaymentHistoryAPI(token, postId);
      console.log('this is the response:', response)
      console.log('this is the response postId:', postId)
      return response.data || [];
    } catch (error) {
      const err = error as Error;
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);



export const createComment = createAsyncThunk('comments/createComment', async (commentData: { postId: string, comment: string},  { getState, rejectWithValue }) => {
  const token = (getState() as RootState).auth.token;
  if (!token) {
    return rejectWithValue('No authentication token available.');
  }
  try {
   const response = await api.createComment(commentData.postId, commentData.comment, token);
   return response.data;
 } catch (error) {
  return rejectWithValue((error as Error).message || 'Unknown error');
 }
});






export const editComment = createAsyncThunk(
  'comments/editComment',
  async ({ commentId, updatedComment }: { commentId: string; updatedComment: string }, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) {
      return rejectWithValue('No authentication token available.');
    }
    try {
      await api.editComment(commentId,  updatedComment, token);
      console.log("this is editComment section:", updatedComment)
      const result = {commentId, updatedComment};
      console.log("Returning from editComment:", result)
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to edit comment');
    }
  }
);



export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId: string, {getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) {
      return rejectWithValue('No authentication token available.');
    }
    try {
      const response = await api.deleteComment(commentId, token);
      return { commentId, response };
    } catch (error) {
      return rejectWithValue((error as Error).message || `Failed to delete comment with id ${commentId}`);
    }
  }
);





export const replyComment = createAsyncThunk(
  'comments/replyComment',
  async (replyData: { commentId: string; reply: string; }, { rejectWithValue }) => {
    try {
      const response = await api.replyToComment(replyData.commentId, replyData.reply,);
      console.log('this is response:', response.data.content);
      return { parentId: replyData.commentId, reply: response}
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to reply to comment');
    }
  }
);



export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await api.fetchCommentsByPostId(postId);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch comments');
    }
  }
);



export const fetchDiscoverableUsers = createAsyncThunk(
  'follow/fetchDiscoverableUsers',
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) {
      return rejectWithValue('No authentication token available.');
    }
    try {
      const response = await api.getDiscoverableUsers(token); 
      return response; 
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch discoverable users');
    }
  }
);




export const fetchFollowingList = createAsyncThunk(
  'follow/fetchFollowingList',
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) {
      return rejectWithValue('No authentication token available.');
    }
    try {
      const response = await api.getFollowingList(token); 
      console.log('this is fetchFollowingList:', response)
      return response; 
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch discoverable users');
    }
  }
);




export const followUser = createAsyncThunk('follow/followUser', async (userId: string, {getState, rejectWithValue }) => {
  const token = (getState() as RootState).auth.token;

  if (!token) {
    return rejectWithValue('No authentication token available.');
  }
  try {
    const response = await api.followUser(userId, token);
    console.log("Backend follow response:", response)
    console.log("this is api.followUser:", userId)
    return response; 

  } catch (error) {
    return rejectWithValue((error as Error).message || 'Unknown error');
  }
});



export const unfollowUser = createAsyncThunk('follow/unfollowUser', async (userId: string, {getState, rejectWithValue }) => {
  const token = (getState() as RootState).auth.token;

  if (!token) {
    return rejectWithValue('No authentication token available.');
  }
  try {
    const response = await api.unfollowUser(userId, token);
    console.log("Backend unfollow response:", response)
    console.log("this is api.unfollowUser:", userId)
    return response; 

  } catch (error) {
    return rejectWithValue((error as Error).message || 'Unknown error');
  }
});





export const fetchFollowedUsers = createAsyncThunk('follow/fetchFollowedUsers', async (token:string, { rejectWithValue }) => {
    if (!token) {
      return rejectWithValue('No authentication token available.');
    }
    try {
      const response = await api.getFollowedUsers(token); 
      console.log('this is getFollowedUsers:', response.content)
      return response.content;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch followed users');
    }
  }
);


export const fetchPremiumContent = createAsyncThunk('premium/fetchPremiumContent', async (_, thunkAPI) => {
  try {
    const response = await api.getPremiumContent();
    console.log('this is response:', response)
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message || 'Failed to fetch premium content');
  }
});






interface PremiumContent {
  _id: string;
  title: string;
  description: string;
  content: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  data?: string;
  __v: number;
}

interface Payment {
  _id: string;
  id?: string;
  paymentId: string;
  postId: string;
  amount: number;
  date: string; 
  status: 'pending' | 'completed' | 'failed';
}





interface reply {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentComment: string;
  post: string;
  text:  string
  replies: reply[];
  __v: number;
  message: string;
  success: boolean;
}

interface Comment {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentComment: string;
  post: string;
  text:  string
  replies: reply[];
  __v: number;
}



export interface User {
  content?: string;
  posts: string;
  userId: string;
  _id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  followers: Array<{ _id: string; name: string; email: string }>;
  following: Array<{ _id: string; name: string; email: string }>;
  success?: boolean;
  message?: string;
  data?: string;
}





// // Initial state
const initialState = {
  paymentStatus: null as 'success' | 'failed' | null,
  comments: [] as Comment[], 
  following: false,
  discoverableUsers: [] as User[], 
  followingList: [] as User[],
  followedUsers: [] as User[],
  replies: [] as {commentId: string; reply: string}[],
  error: null as string | null,
  premiumContent: null as PremiumContent | null,
  paymentHistory: [] as Payment[],
  loading: false,
};



// Slice
const actionsSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
extraReducers: (builder) => {
    builder
      .addCase(makePayment.fulfilled, (state) => {
        state.paymentStatus = 'success';
      }) 
      
      .addCase(makePayment.rejected, (state, action) => {
        state.paymentStatus = 'failed';
        state.error = action.payload as string;
      })
  
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.paymentHistory = action.payload;
        state.loading = false;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Failed to fetch payment history:', action.payload);

      })
  
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      builder.addCase(editComment.fulfilled, (state, action: PayloadAction<{ commentId: string; updatedComment: string }>) => {
        const { commentId, updatedComment } = action.payload;
      
        console.log('Payload received in editComment.fulfilled:', action.payload);
      
        const commentIndex = state.comments.findIndex((comment) => comment._id === commentId);
      
        if (commentIndex !== -1) {
          state.comments[commentIndex] = {
            ...state.comments[commentIndex], 
            text: updatedComment,
          };
      
          console.log('Updated comment:', state.comments[commentIndex]);
        } else {
          console.warn('Comment not found in state with id:', commentId);
        }
      })
     .addCase(editComment.rejected, (state, action) => {
        console.error('Failed to edit comment:', action.payload);
      })
  
      .addCase(deleteComment.fulfilled, (state, action) => {
        console.log('Comment deleted with ID:', action.payload.commentId);
        const { commentId } = action.payload;
        state.comments = state.comments.filter(comment => comment._id !== commentId);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload as string;
      })

       .addCase(fetchComments.fulfilled, (state, action) => {
         state.comments = action.payload;
         console.log("Comments fetched and updated:", state.comments);
       })
     
       .addCase(replyComment.fulfilled, (state, action) => {
         const { parentId, reply } = action.payload;
         console.log("this is action.payload of replyComment:", action.payload);
     
         const commentsCopy = [...state.comments];
         console.log("Comments before update:", commentsCopy);
     
         const parentComment = commentsCopy.find(comment => comment._id === parentId);
     
         if (parentComment) {
           parentComment.replies = parentComment.replies || [];
           parentComment.replies.push(reply);
     
           state.comments = commentsCopy;
           console.log("Updated comments:", state.comments);
         } else {
           console.warn("Parent comment not found in state with id:", parentId);
         }
       })
      .addCase(replyComment.rejected, (state, action) => {
         state.error = action.payload as string;
       })
      .addCase(fetchDiscoverableUsers.pending, (state) => {
         state.loading = true;
       })
      .addCase(fetchDiscoverableUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.discoverableUsers = action.payload;
        console.log('Discoverable Users:', action.payload);
       })
      .addCase(fetchDiscoverableUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
       })
      .addCase(fetchFollowingList.pending, (state)=> {
        state.loading = true;
       })

      .addCase(fetchFollowingList.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.followingList = action.payload;
        console.log('FollowingList:', action.payload);
      })
      .addCase(fetchFollowingList.rejected, (state, action) => {
        state.loading = false;
        state.error =  action.payload as string;
      })

      .addCase(fetchFollowedUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.followingList = action.payload;
        console.log('FollowingList:', action.payload);
      })
      .addCase(fetchFollowedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =  action.payload as string;
      })

     
      .addCase(followUser.fulfilled, (state, action: PayloadAction<User>) => {
        if(Array.isArray(state.followingList)) {
          state.followingList.push(action.payload);
        }
        console.log('this is followUsers', action.payload);
        state.error = null;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      .addCase(unfollowUser.fulfilled, (state, action: PayloadAction<User>) => {
        if(Array.isArray(state.followingList)) {
          state.followingList.push(action.payload);
        }
        console.log('this is followUsers', action.payload);
        state.error = null;
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      

      .addCase(fetchPremiumContent.fulfilled, (state, action) => {
         state.premiumContent = action.payload;
       })
      .addCase(fetchPremiumContent.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});
    
   export const selectFollowedUsers = (state: RootState) => state.action.followedUsers;
   export const { clearErrors } = actionsSlice.actions;
   export default actionsSlice.reducer;











