"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface RoleRedirectProps {
  allowedRole?: "USER" | "ADMIN" | string;
  children: React.ReactNode;
}

export function RoleRedirect({ allowedRole, children }: RoleRedirectProps) {
  const router = useRouter();
  const { user, profileLoading, token } = useAuth();

  const authStatus = useMemo(() => {
    // 1. Still fetching profile data
    if (profileLoading) return "loading";

    // 2. No token or no user means they need to log in
    if (!token || !user) return "unauthenticated";

    // Safely transform roles to uppercase for consistency
    const userRole = user.role?.toUpperCase(); // "USER"
    const requiredRole = allowedRole?.toUpperCase();

    // Account for explicit super admin boolean flags overrides
    const isAdmin = user.is_admin === true || userRole === "ADMIN";

    // 3. Evaluate specific role permissions for the protected route path
    if (requiredRole) {
      if (requiredRole === "ADMIN" && !isAdmin) {
        return "redirect_to_own_dashboard";
      }
      if (requiredRole === "USER" && userRole !== "USER" && !isAdmin) {
        return "redirect_to_own_dashboard";
      }
    }

    return "authorized";
  }, [user, profileLoading, token, allowedRole]);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      // router.replace("/login");
    } else if (authStatus === "redirect_to_own_dashboard") {
      // Direct users checking safe lowercase/uppercase variants plus structural flags
      const isAdmin =
        user?.is_admin === true || user?.role?.toUpperCase() === "ADMIN";

      if (isAdmin) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/goooooooooo");
      }
    }
  }, [authStatus, router, user]);

  // Render spinner component on evaluation delays or active redirection transitions
  if (
    authStatus === "loading" ||
    authStatus === "unauthenticated" ||
    authStatus === "redirect_to_own_dashboard"
  ) {
    return (
      <div className='flex h-[60vh] w-full items-center justify-center'>
        <Loader className='animate-spin h-5 w-5 text-primary' />
      </div>
    );
  }

  return <>{children}</>;
}

// "use client";

// import { useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { Loader } from "lucide-react";
// import { useAuth } from "@/hooks/useAuth";

// interface RoleRedirectProps {
//   allowedRole?: "USER" | "ADMIN" | string;
//   children: React.ReactNode;
// }

// export function RoleRedirect({ allowedRole, children }: RoleRedirectProps) {
//   const router = useRouter();
//   const { user, profileLoading, token } = useAuth();

//   const authStatus = useMemo(() => {
//     // 1. Still fetching profile
//     if (profileLoading) return "loading";

//     // 2. No token or no user means they need to log in
//     if (!token || !user) return "unauthenticated";

//     const userRole = user.role?.toUpperCase();
//     const requiredRole = allowedRole?.toUpperCase();

//     // 3. Check if user has the specific role required for this route
//     if (requiredRole && userRole !== requiredRole) {
//       return `redirect_to_own_dashboard`;
//     }

//     return "authorized";
//   }, [user, profileLoading, token, allowedRole]);

//   useEffect(() => {
//     if (authStatus === "unauthenticated") {
//       // router.replace("/login");
//     } else if (authStatus === "redirect_to_own_dashboard") {
//       // Redirect logic based on their actual role
//       if (user?.role === "ADMIN") {
//         router.replace("/admin/dashboard"); // Or whatever your admin path is
//       } else {
//         router.replace("/"); // Standard user home or dashboard
//       }
//     }
//   }, [authStatus, router, user]);

//   // Show loader for loading state, or an empty div during redirect to prevent flicker
//   if (
//     authStatus === "loading" ||
//     authStatus === "unauthenticated" ||
//     authStatus === "redirect_to_own_dashboard"
//   ) {
//     return (
//       <div className='flex h-[60vh] w-full items-center justify-center'>
//         <Loader className='animate-spin h-8 w-8 text-primary' />
//       </div>
//     );
//   }

//   return <>{children}</>;
// }
