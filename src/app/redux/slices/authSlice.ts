import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
