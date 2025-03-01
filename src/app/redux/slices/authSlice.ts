import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/api";



export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isAdmin: boolean;
  role: string;
  token?: string;
}

const initialState = {
  user: null as User | null,
  isAuthenticated: false,
  token: null as string | null,
};

export interface ProfileData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await api.loginUser(email, password);
    return response;
  }
);


export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData: ProfileData) => {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }
    const response = await api.updateProfile("/auth/update-profile", profileData, token);
    console.log("this is the authSlice updateProfile data:", response);
    return response;
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.token = action.payload.token || null;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
 
    restoreSession(state) {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (user) {
              state.user = user;
              state.isAuthenticated = true;
              state.token = token;
            }
          } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
            localStorage.removeItem("user");
          }
        }
      }
    }
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.user = user;
        state.isAuthenticated = true;
        state.token = token;
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        }
      })
      
      .addCase(login.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = { ...state.user, ...action.payload };
          console.log("Updated user in Redux state:", state.user);
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(state.user));
          }
        } else {
          console.error("Update profile fulfilled with undefined payload!");
        }
      })
      
  },
});

export const { setUser, logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
