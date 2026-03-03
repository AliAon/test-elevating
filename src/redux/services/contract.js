import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contractApi = createApi({
  reducerPath: "contractApi",
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
  tagTypes: ["Contract"],

  endpoints: (builder) => ({
    createContract: builder.mutation({
      query: (body) => ({
        url: `/api/v1/service-contracts`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Contract"],
    }),
    updateContract: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/v1/service-contracts/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Contract"],
    }),
    getContracts: builder.query({
      query: ({ filters = {}, debouncedQuery }) => {
        const params = new URLSearchParams();
        if (filters.sortBy) params.append("sortBy", filters.sortBy);
        if (filters.dateFrom) params.append("startDate", filters.dateFrom);
        if (filters.dateTo) params.append("endDate", filters.dateTo);
        if (filters.active) params.append("active", filters.active);
        if (filters.page) params.append("page", filters.page);
        if (debouncedQuery) params.append("search", debouncedQuery);
        if (filters.limit) params.append("limit", filters.limit);
        if (filters.clientId) params.append("clientId", filters.clientId);
        if (filters.brand_id) params.append("brand_id", filters.brand_id);
        if (filters?.buildingIds?.length > 0)
          params.append("buildingIds", filters.buildingIds.join(","));
        if (filters.contractType)
          params.append("contractType", filters.contractType);
        if (filters.es_subscription_id)
          params.append("es_subscription_id", filters.es_subscription_id);

        return {
          url: `/api/v1/service-contracts?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Contract"],
    }),
    getContractById: builder.query({
      query: (id) => ({
        url: `/api/v1/service-contracts/${id}`,
        method: "GET",
      }),
      providesTags: ["Contract"],
    }),
  }),
});

export const {
  useCreateContractMutation,
  useUpdateContractMutation,
  useGetContractsQuery,
  useGetContractByIdQuery,
} = contractApi;
