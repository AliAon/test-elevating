import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const logApi = createApi({
  reducerPath: "logApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),
  tagTypes: ["Log"],

  endpoints: (builder) => ({
    // ✅ Get all logs
    getAllLogs: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams(params).toString();

        return {
          url: `/api/v1/logs?${searchParams}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response.data,
      providesTags: ["Log"],
    }),

    // ✅ Create new log
    createLog: builder.mutation({
      query: (formData) => ({
        url: `/api/v1/logs`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Log"],
    }),

    // ✅ Update existing log
    updateLog: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/v1/logs/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Log"],
    }),

    // ✅ Delete log
    deleteLog: builder.mutation({
      query: (id) => ({
        url: `/api/v1/logs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Log"],
    }),

    // ✅ Get log details
    getLogDetails: builder.query({
      query: (id) => ({
        url: `/api/v1/logs/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Log"],
    }),
  }),
});

export const {
  useGetAllLogsQuery,
  useGetLogDetailsQuery,
  useCreateLogMutation,
  useUpdateLogMutation,
  useDeleteLogMutation,
} = logApi;
