import { baseAPI } from "@/redux/api/api";

const settingsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: `/user/profile`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/user/update-profile`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    updatePassword: builder.mutation({
      query: (data) => ({
        url: `/auth/change-password`,
        method: "POST",
        body: data,
      }),
    }),

    getTermsAndConditions: builder.query({
      query: () => ({
        url: `/terms`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),

    setTermsAndConditions: builder.mutation({
      query: (data) => ({
        url: `/terms`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),

    getPrivacyPolicy: builder.query({
      query: () => ({
        url: `/privacy`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),

    setPrivacyPolicy: builder.mutation({
      query: (data) => ({
        url: `/privacy`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),

    getAbout: builder.query({
      query: () => ({
        url: `/about`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),

    setAbout: builder.mutation({
      query: (data) => ({
        url: `/about`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),

    getCommunityGuidelines: builder.query({
      query: () => ({
        url: `/guidelines`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),

    setCommunityGuidelines: builder.mutation({
      query: (data) => ({
        url: `/guidelines`,
        method: "PATCH",
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
  useGetTermsAndConditionsQuery,
  useSetTermsAndConditionsMutation,
  useGetPrivacyPolicyQuery,
  useSetPrivacyPolicyMutation,
  useGetAboutQuery,
  useSetAboutMutation,
  useGetCommunityGuidelinesQuery,
  useSetCommunityGuidelinesMutation,
} = settingsAPI;
export default settingsAPI;
