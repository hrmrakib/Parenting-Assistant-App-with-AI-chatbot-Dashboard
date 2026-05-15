import baseAPI from "@/redux/api/api";

const userAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query({
      query: () => ({
        url: `/user/profile`,
        method: "GET",
      }),
    }),

    getAllUsers: build.query({
      query: (params) => ({
        url: `/user/all-user`,
        method: "GET",
        params,
      }),
    }),

    getUserById: build.query({
      query: ({ id, params }) => ({
        url: `/user/profile/${id}`,
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetProfileQuery, useGetAllUsersQuery, useGetUserByIdQuery } =
  userAPI;
export default userAPI;
