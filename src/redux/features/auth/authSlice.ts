/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TUser = {
  id: string; // Changed from _id to match your API
  name: string;
  email: string;
  role: "user" | "admin" | "USER" | "ADMIN" | string;
  avatar: string; // Changed from image to match your API
  gender?: "MALE" | "FEMALE" | string;
  is_verified: boolean;
  is_active?: boolean;
  is_admin?: boolean;
  is_deleted?: boolean;
  balance?: number;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
  // Optional fields for flexibility
  is_stripe_connected?: boolean;
  current_account_id?: string | null;
  phone?: string;
  bio?: string;
  address?: string;
};

type TAuthState = {
  userToggle: boolean;
  user: TUser | null;
  token: string | null;
  profileLoading: boolean;
};

const initialState: TAuthState = {
  userToggle: false,
  user: null,
  token: null,
  profileLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userTrack: (state) => {
      state.userToggle = !state.userToggle;
    },

    setUser: (
      state,
      action: PayloadAction<{ user: TUser; token: string | null }>,
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      if (token) {
        state.token = token;
      }
    },

    updateProfile: (state, action: PayloadAction<Partial<TUser>>) => {
      if (state.user) {
        // Merge existing user data with updated fields
        state.user = { ...state.user, ...action.payload };
      } else {
        state.user = action.payload as TUser;
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userToggle = false;
    },

    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.profileLoading = action.payload;
    },
  },
});

export const { userTrack, setUser, updateProfile, logout, setProfileLoading } =
  authSlice.actions;
export default authSlice.reducer;
