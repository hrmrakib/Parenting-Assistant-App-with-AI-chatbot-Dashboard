"use client";

import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";

// ─── Logout Helper ────────────────────────────────────────────────────────────
let isLoggingOut = false;

const forceLogout = (
  message = "Session expired. Please login again.",
): void => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  localStorage?.removeItem("access_token");
  toast.error(message);

  setTimeout(() => {
    isLoggingOut = false;
    window.location.replace("/login");
  }, 400);
};

// ─── Token Refresh ────────────────────────────────────────────────────────────
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!response.ok) return null;

    const data = await response.json();
    const newToken: string | undefined = data?.data?.access_token;

    if (newToken) {
      localStorage.setItem("access_token", newToken);
      return newToken;
    }

    return null;
  } catch {
    return null;
  }
};

// ─── Base Query ───────────────────────────────────────────────────────────────
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    if (typeof window !== "undefined") {
      const token = localStorage?.getItem("access_token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
    }
    return headers;
  },
});

// ─── Custom Base Query ────────────────────────────────────────────────────────
const customBaseQuery: BaseQueryFn<
  FetchArgs | string,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (typeof window === "undefined") return result;

  const pathname = window?.location?.pathname || "";

  if (result.error?.status === 401) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      result = await baseQuery(args, api, extraOptions);

      if (result.error?.status === 401 && pathname !== "/login") {
        forceLogout();
      }
    } else if (pathname !== "/login") {
      forceLogout();
    }
  } else if (result.error?.status === 403) {
    alert("You need to verify your email to use this feature.");
    if (window?.location?.href) window.location.href = "/profile";
  } else if (result.error?.status === 402) {
    alert("You need to upgrade your plan to use this feature.");
    if (window?.location?.href) window.location.href = "/#upgrade-plan";
  }

  return result;
};

// ─── Base API ─────────────────────────────────────────────────────────────────
export const baseAPI = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: [
    "Post",
    "Profile",
    "Settings",
    "Content",
    "Notification",
    "Milestone",
  ],
  endpoints: () => ({}),
});

export default baseAPI;

export type TList = {
  page?: number;
  limit?: number;
  search?: string;
};

// "use client";

// import {
//   BaseQueryFn,
//   createApi,
//   FetchArgs,
//   fetchBaseQuery,
//   FetchBaseQueryError,
// } from "@reduxjs/toolkit/query/react";
// import { toast } from "sonner";

// const baseQuery = fetchBaseQuery({
//   baseUrl: process.env.NEXT_PUBLIC_API_URL,
//   credentials: "include",
//   prepareHeaders: (headers) => {
//     console.log("Preparing headers for API request", window?.location?.href);

//     if (typeof window !== "undefined") {
//       const token = localStorage?.getItem("access_token");
//       if (token) {
//         headers.set("authorization", `Bearer ${token}`);
//       }
//     }
//     return headers;
//   },
// });

// let isLoggingOut = false;

// const customBaseQuery: BaseQueryFn<
//   FetchArgs | string,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   const result = await baseQuery(args, api, extraOptions);

//   if (typeof window === "undefined") {
//     return result;
//   }

//   const pathname = window?.location?.pathname || "";

//   if (result.error && result.error.status === 401) {
//     if (!isLoggingOut && pathname !== "/login") {
//       isLoggingOut = true;
//       localStorage?.removeItem("access_token");

//       toast.error("Session expired. Please login again.");

//       if (window?.location?.replace) {
//         setTimeout(() => {
//           isLoggingOut = false;
//           window.location.replace("/login");
//         }, 400);
//       }
//     }
//   } else if (result.error && result.error.status === 403) {
//     alert("You need to verify your email to use this feature.");
//     if (window?.location?.href) window.location.href = "/profile";
//   } else if (result.error && result.error.status === 402) {
//     alert("You need to upgrade your plan to use this feature.");
//     if (window?.location?.href) window.location.href = "/#upgrade-plan";
//   }

//   return result;
// };

// export const baseAPI = createApi({
//   reducerPath: "api",
//   baseQuery: customBaseQuery,
//   tagTypes: ["Post", "Profile", "Settings"],
//   endpoints: () => ({}),
// });

// export default baseAPI;

// export type TList = {
//   page?: number;
//   limit?: number;
//   search?: string;
// };
