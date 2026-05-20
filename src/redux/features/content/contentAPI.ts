import baseAPI from "@/redux/api/api";

const contentAPI = baseAPI.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getAllContent: builder.query({
      query: (params) => ({
        url: `/contents`,
        method: "GET",
        params,
      }),
      providesTags: ["Content"],
    }),

    getContentDetailById: builder.query({
      query: ({ id }) => ({
        url: `/contents/${id}`,
        method: "GET",
      }),
      providesTags: ["Content"],
    }),

    createContent: builder.mutation({
      query: (data) => ({
        url: `/contents`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Content"],
    }),

    updateContent: builder.mutation({
      query: ({ id, data }) => ({
        url: `/contents/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Content"],
    }),

    deleteContent: builder.mutation({
      query: ({ id }) => ({
        url: `/contents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Content"],
    }),
  }),
});

export const {
  useGetAllContentQuery,
  useGetContentDetailByIdQuery,
  useCreateContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
} = contentAPI;
export default contentAPI;
