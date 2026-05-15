import baseAPI from "@/redux/api/api";

const notificationAPI = baseAPI.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: `/account-notifications`,
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    /** read notification
     *  body: {
            "id": "37b96e02-7c62-4071-b684-163403560365",
            "is_read": true
        }
     */

    readNotification: builder.mutation({
      query: (body) => ({
        url: `/account-notifications/mark-as-read$`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Notification"],
    }),

    /** delete notification
     *  body: {
            "id": "37b96e02-7c62-4071-b684-163403560365" //optional
        }
     */

    deleteNotification: builder.mutation({
      query: (body) => ({
        url: `/account-notifications`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useReadNotificationMutation,
  useDeleteNotificationMutation,
} = notificationAPI;

export default notificationAPI;
