import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_AUTH_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("ngrok-skip-browser-warning", "true");

      return headers;
    },
  }),
  tagTypes: ["User"],

  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (body) => ({
        url: `/users`,
        method: "POST",
        body: body,
      }),
    }),
    logIn: builder.mutation({
      query: (body) => ({
        url: `/api/v1/auth/login`,
        method: "POST",
        body: body,
      }),
    }),
    otp: builder.mutation({
      query: (body) => ({
        url: `/api/v1/auth/request-password-otp`,
        method: "POST",
        body: body,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (body) => ({
        url: `/api/v1/auth/verify-otp`,
        method: "POST",
        body: body,
      }),
    }),
    restPassword: builder.mutation({
      query: (body) => ({
        url: `/api/v1/auth/reset-password`,
        method: "POST",
        body: body,
      }),
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/api/v1/users/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    createClient: builder.mutation({
      query: (body) => ({
        url: `/api/v1/users`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["User"],
    }),
    UpdateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/v1/users/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["User"],
    }),
    getUsers: builder.query({
      query: ({ user_type_id, search, limit }) => {
        const params = new URLSearchParams();
        if (search) params.append("serach", search);
        if (user_type_id) params.append("user_type_id", user_type_id);
        if (limit) params.append("limit", limit);
        return {
          url: `/api/v1/users?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: `/api/v1/users/profile/update`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: `/api/v1/users/change-password`,
        method: "POST",
        body: body,
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useLogInMutation,
  useOtpMutation,
  useVerifyOtpMutation,
  useRestPasswordMutation,
  useGetUserByIdQuery,
  useCreateClientMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
