import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function useAuth() {
  const { user, token, profileLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  // Normalize role to uppercase for consistent checking
  const userRole = user?.role?.toUpperCase();

  return {
    user,
    token,
    profileLoading,

    // Check if both user object and token exist
    isLoggedIn: !!user && !!token,

    // Updated to match the snake_case 'is_verified' from your API
    isVerified: user?.is_verified ?? false,

    // Case-insensitive role checks
    isAdmin: userRole === "ADMIN",

    isUser: userRole === "USER",

    // Helper to check if the user is active
    isActive: user?.is_active ?? false,
  };
}
