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
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const { data, isLoading } = useGetProfileQuery({}, { skip: !token });

  useEffect(() => {
    if (!token) {
      dispatch(setProfileLoading(false));
      return;
    }

    dispatch(setProfileLoading(isLoading));
  }, [isLoading, token, dispatch]);

  useEffect(() => {
    if (data?.data) {
      dispatch(
        setUser({ user: data.data, token: data?.data?.accessToken || token }),
      );
    }
  }, [data, token, dispatch]);

  return children;
}
