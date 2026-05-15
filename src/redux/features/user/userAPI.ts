import baseAPI from "@/redux/api/api";

const userAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query({
      query: (params) => ({
        url: `/admin/users`,
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetAllUsersQuery } = userAPI;
export default userAPI;
