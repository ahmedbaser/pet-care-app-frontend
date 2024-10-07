import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../utils/api';
import api from '../../utils/api'

export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
  const response = await api.get('/users');
  return response.data;
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (id: string) => {
  await api.delete(`/users/${id}`);
  return id;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    });
  },
});

export default userSlice.reducer;
