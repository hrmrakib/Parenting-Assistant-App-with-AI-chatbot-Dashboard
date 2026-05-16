import baseAPI from "@/redux/api/api";

const AuthenticationAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getNewAccessToken: builder.query({
      query: (body) => ({
        url: "/auth/refresh-token",
        method: "GET",
        body,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/verify-email",
        method: "POST",
        body,
      }),
    }),

    resendOtpForPasswordReset: builder.mutation({
      query: (body) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/forgot-password-otp-send",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    verifyForgetPasswordOtpVerify: builder.mutation({
      query: (body) => ({
        url: "/auth/forgot-password-otp-verify",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetNewAccessTokenQuery,
  useVerifyOtpMutation,
  useResendOtpForPasswordResetMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyForgetPasswordOtpVerifyMutation,
} = AuthenticationAPI;
export default AuthenticationAPI;
