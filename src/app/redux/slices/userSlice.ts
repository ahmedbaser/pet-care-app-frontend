import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Define the User type
type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
  isActive: boolean;
};


// Define the structure for Axios-like error responses
interface AxiosError {
  response?: {
    data?: {
      message: string;
    };
  };
}

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk<User[], void>('user/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token'); 
    if (!token) {
      throw new Error('No token found');
    }
    const users = await api.getUsers(token);
    console.log('this is users section:', users)
    return users;
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch users');
  }
});

// Async thunk to delete a user by ID
export const deleteUser = createAsyncThunk<string, string>('user/deleteUser', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    await api.deleteUser(id, token); 
    return id;
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(axiosError.response?.data?.message || 'Failed to delete user');
  }
});

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [] as User[], 
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
