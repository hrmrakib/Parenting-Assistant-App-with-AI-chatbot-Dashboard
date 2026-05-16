import baseAPI from "@/redux/api/api";

const overviewAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getOverview: build.query({
      query: (arg) => ({
        url: "/admin/dashboard",
        method: "GET",
        params: { searchTerm: arg?.searchTerm || "" },
      }),
    }),
  }),
});

export const { useGetOverviewQuery } = overviewAPI;
export default overviewAPI;
