import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminClientApi = createApi({
  reducerPath: "adminClientApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("ngrok-skip-browser-warning", "true");

      return headers;
    },
  }),
  tagTypes: ["Client"],

  endpoints: (builder) => ({
    createClient: builder.mutation({
      query: (body) => ({
        url: `/api/v1/clients`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Client"],
    }),
    updateClient: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/v1/clients/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Client"],
    }),
    getClientById: builder.query({
      query: (id) => ({
        url: `/api/v1/clients/${id}`,
        method: "GET",
      }),
      providesTags: ["Client"],
    }),
    getAllClients: builder.query({
      query: ({ filters = { limit: 100 }, debouncedQuery }) => {
        const params = new URLSearchParams();

        if (filters.sort) params.append("sort", filters.sort);
        if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
        if (filters.dateTo) params.append("dateTo", filters.dateTo);
        if (debouncedQuery) params.append("search", debouncedQuery);
        if (filters.page) params.append("page", filters.page);
        if (filters.limit) params.append("limit", filters.limit);

        return {
          url: `/api/v1/clients${
            params.toString() ? `?${params.toString()}` : ""
          }`,
          method: "GET",
        };
      },
      providesTags: ["Client"],
    }),
    ////////
    getUserById: builder.query({
      query: (id) => ({
        url: `/api/v1/users/${id}`,
        method: "GET",
      }),
      providesTags: ["Client"],
    }),
    UpdateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/v1/users/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Client"],
    }),
    UpdateProfile: builder.mutation({
      query: (body) => ({
        url: `/api/v1/users/profile/update`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Client"],
    }),
  }),
});

export const {
  useCreateClientMutation,
  useUpdateClientMutation,
  useGetClientByIdQuery,
  useGetAllClientsQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useUpdateProfileMutation,
} = adminClientApi;
