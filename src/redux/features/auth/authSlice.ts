/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TUser = {
  _id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | string;
  image: string;
  address?: string;
  phone?: string;
  bio?: string;
  verified?: boolean;
  isDeleted?: boolean;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  interested?: any[];
  createdAt?: string;
  updatedAt?: string;
  // Fields below were in your type but missing from API response
  // Marked as optional so the app doesn't crash when missing
  googleId?: string;
  appleId?: string;
  stripeAccountId?: string;
  isStripeConnected?: boolean;
  post?: number;
  follower?: number;
  following?: number;
  paypalAccount?: string;
  income?: number;
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
      // Only update token if it's provided in the payload
      if (token) {
        state.token = token;
      }
    },

    // New reducer to update profile specifically without touching the token
    updateProfile: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
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
