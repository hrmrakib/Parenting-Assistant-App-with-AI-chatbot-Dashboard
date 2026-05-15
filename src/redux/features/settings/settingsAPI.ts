import { baseAPI } from "@/redux/api/api";

type TContextPage = {
  page_name: "about-us" | "terms" | "privacy-policy";
  content: string;
};

const settingsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: `/profile`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/profile/edit`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    updatePassword: builder.mutation({
      query: (data) => ({
        url: `/profile/change-password`,
        method: "POST",
        body: data,
      }),
    }),

    getAbout: builder.query({
      query: () => ({
        url: `/context-pages/about-us`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),

    getTerms: builder.query({
      query: () => ({
        url: `/context-pages/terms`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),

    getPrivacyPolicy: builder.query({
      query: () => ({
        url: `/context-pages/privacy-policy`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),

    // Unified mutation for all static pages
    updateContextPage: builder.mutation({
      query: (data: TContextPage) => ({
        url: `/admin/context-pages/modify`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useGetAboutQuery,
  useGetTermsQuery,
  useGetPrivacyPolicyQuery,
  useUpdateContextPageMutation,
} = settingsAPI;
export default settingsAPI;
