import { baseAPI } from "@/redux/api/api";

const reportAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: (params) => ({
        url: `/report`,
        method: "GET",
        params,
      }),
    }),

    removeReportedPost: builder.mutation({
      query: (id) => ({
        url: `post/admin/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetReportsQuery, useRemoveReportedPostMutation } = reportAPI;
export default reportAPI;
