import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const costApi = createApi({
  reducerPath: "costApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("ngrok-skip-browser-warning", "true");

      return headers;
    },
  }),
  tagTypes: ["Cost"],

  endpoints: (builder) => ({
    // ✅ Get all Cost Infos
    getAllCostInfos: builder.query({
      query: () => ({
        url: `/api/v1/cost-infos`,
        method: "GET",
      }),
      providesTags: ["Cost"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    // ✅ Create new Cost
    createCostInfo: builder.mutation({
      query: (body) => ({
        url: `/api/v1/cost-infos`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cost"],
    }),
    // ✅ Get Cost by ID
    getCostById: builder.query({
      query: (id) => ({
        url: `/api/v1/cost-infos/`,
        method: "GET",
      }),
      providesTags: ["Cost"],
      transformResponse: (response) => response.data,
    }),

    // ✅ Update existing Cost
    updateCost: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/v1/cost-infos/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Cost"],
    }),
  }),
});

export const {
  useGetAllCostInfosQuery,
  useGetCostByIdQuery,
  useCreateCostInfoMutation,
  useUpdateCostMutation,
} = costApi;
