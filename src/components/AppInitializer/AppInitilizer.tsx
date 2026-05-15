"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetProfileQuery } from "@/redux/features/settings/settingsAPI";
import { setProfileLoading, setUser } from "@/redux/features/auth/authSlice";

export default function AppInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  // Safely get the token from localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // Fetch profile only if token exists
  const { data, isLoading, isSuccess, isError } = useGetProfileQuery(
    {},
    { skip: !token },
  );

  // Synchronize loading state
  useEffect(() => {
    // if no token, we aren't loading a profile
    if (!token) {
      dispatch(setProfileLoading(false));
      return;
    }
    dispatch(setProfileLoading(isLoading));
  }, [isLoading, token, dispatch]);

  // Handle successful data retrieval
  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(
        setUser({
          user: data.data,
          token: token, // Use the existing token as the profile API usually doesn't return a new one
        }),
      );
    }

    // Optional: Handle error (e.g., token expired)
    if (isError) {
      dispatch(setProfileLoading(false));
    }
  }, [data, isSuccess, isError, token, dispatch]);

  return children;
}
