import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userTypeApi = createApi({
  reducerPath: "userTypeApi",
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
  tagTypes: ["Subscription"],

  endpoints: (builder) => ({
    getUserTypes: builder.query({
      query: () => ({
        url: "/api/v1/user-types",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserTypesQuery } = userTypeApi;
