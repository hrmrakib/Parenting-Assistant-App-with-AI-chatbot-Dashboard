import baseAPI from "@/redux/api/api";

const milestonesAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentMilestone: builder.query({
      query: (params) => ({
        url: "/milestones/current",
        method: "GET",
        params,
      }),
      providesTags: ["Milestone"],
    }),

    getMilestoneById: builder.query({
      query: (id) => ({
        url: `/milestones/${id}`,
        method: "GET",
      }),
      providesTags: ["Milestone"],
    }),

    getAllMilestones: builder.query({
      query: (params) => ({
        url: "/milestones",
        method: "GET",
        params,
      }),
      providesTags: ["Milestone"],
    }),

    createMilestone: builder.mutation({
      query: (data) => ({
        url: "/milestones",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Milestone"],
    }),

    updateMomMilestone: builder.mutation({
      query: (data) => ({
        url: `/milestones`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Milestone"],
    }),

    updateBabyMilestone: builder.mutation({
      query: (data) => ({
        url: `/milestones`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Milestone"],
    }),

    deleteMilestone: builder.mutation({
      query: (body) => ({
        url: `/milestones`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Milestone"],
    }),

    // For todo

    createMilestoneTodo: builder.mutation({
      query: (data) => ({
        url: `/milestones/todos`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Milestone"],
    }),

    updateMilestoneTodo: builder.mutation({
      query: (data) => ({
        url: `/milestones/todos`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Milestone"],
    }),

    deleteMilestoneTodo: builder.mutation({
      query: (body) => ({
        url: `/milestones/todos`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Milestone"],
    }),

    connectContentToMilestone: builder.mutation({
      query: (body) => ({
        url: `/milestones/connect-content`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Milestone"],
    }),
  }),
});

export const {
  useGetCurrentMilestoneQuery,
  useGetMilestoneByIdQuery,
  useGetAllMilestonesQuery,
  useCreateMilestoneMutation,
  useUpdateMomMilestoneMutation,
  useUpdateBabyMilestoneMutation,
  useDeleteMilestoneMutation,
  useCreateMilestoneTodoMutation,
  useUpdateMilestoneTodoMutation,
  useDeleteMilestoneTodoMutation,
  useConnectContentToMilestoneMutation,
} = milestonesAPI;

export default milestonesAPI;
