import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const serviceContractApi = createApi({
  reducerPath: "serviceContractApi",
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
  tagTypes: ["Subscription"],

  endpoints: (builder) => ({
    getAllServiceContracts: builder.query({
      query: ({
        search,
        page,
        limit = 30,
        es_subscription_id,
        client_id,
        brand_id,
        buildingIds,
        contractType,
      }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (client_id) params.append("clientId", client_id);
        if (es_subscription_id)
          params.append("es_subscription_id", es_subscription_id);
        if (brand_id) params.append("brand_id", brand_id);
        if (buildingIds?.length > 0)
          params.append("buildingIds", buildingIds.join(","));
        if (contractType) params.append("contractType", contractType);

        return {
          url: `/api/v1/service-contracts?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    getServiceContractById: builder.query({
      query: (id) => ({
        url: `/api/v1/service-contracts/${id}`,
        method: "GET",
      }),
    }),
    getServiceContractStats: builder.query({
      query: ({ es_subscription_id, level1, level2, level3 }) => {
        const params = new URLSearchParams();
        if (level1) params.append("level1", level1);
        if (level2) params.append("level2", level2);
        if (level3) params.append("level3", level3);
        return {
          url: `/api/v1/service-contracts/client/dashboard/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetAllServiceContractsQuery,
  useGetServiceContractByIdQuery,
  useGetServiceContractStatsQuery,
} = serviceContractApi;
