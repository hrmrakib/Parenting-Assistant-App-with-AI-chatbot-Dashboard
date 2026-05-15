import { baseAPI } from "@/redux/api/api";

const serviceActivitiesAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllPublishedPost: builder.query({
      query: (params) => ({
        url: `/post/published`,
        method: "GET",
        params,
      }),
    }),

    getAllSuspeciousPost: builder.query({
      query: (params) => ({
        url: `/post/suspicious`,
        method: "GET",
        params,
      }),
    }),

    getAllBlockPost: builder.query({
      query: (params) => ({
        url: `/post/blocked`,
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useGetAllPublishedPostQuery,
  useGetAllSuspeciousPostQuery,
  useGetAllBlockPostQuery,
} = serviceActivitiesAPI;
export default serviceActivitiesAPI;
