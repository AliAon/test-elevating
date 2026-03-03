import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const responseTimeApi = createApi({
  reducerPath: "responseTimeApi",
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
    getResponseTime: builder.query({
      query: ({
        level1,
        level2,
        level3,
        service_contract,
        es_subscription_id,
      }) => {
        const params = new URLSearchParams();
        if (level1) params.append("level1", level1);
        if (level2) params.append("level2", level2);
        if (level3) params.append("level3", level3);
        if (service_contract)
          params.append("service_contract", service_contract);

        return {
          url: `/api/v1/response-time/responsetime-history/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    getResponseTimeBuilding: builder.query({
      query: ({
        level1 = "all",
        level2 = "all",
        level3 = "all",
        service_contract = "all",
        month,
        es_subscription_id,
        user_id,
      }) => {
        const params = new URLSearchParams();
        params.append("level1", level1);
        params.append("level2", level2);
        params.append("level3", level3);
        // params.append("service_contract", service_contract);
        if (month) params.append("month", month);
        if (user_id) params.append("user_id", user_id);

        return {
          url: `/api/v1/response-time/summary-with-building-graphs/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    getResponseTimeSummaryBuilding: builder.query({
      query: ({
        level1 = "all",
        level2 = "all",
        service_contract = "all",
        user_id,
        es_subscription_id,
        building_id,
      }) => {
        const params = new URLSearchParams();
        params.append("level1", level1);
        params.append("level2", level2);
        params.append("service_contract", service_contract);

        if (user_id) params.append("user_id", user_id);

        if (building_id) params.append("building_id", building_id);

        return {
          url: `/api/v1/response-time/summary-for-building/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    getResponseHistory: builder.query({
      query: ({
        level1 = "all",
        level2 = "all",
        service_contract = "all",
        user_id,
        es_subscription_id,
        building_id,
      }) => {
        const params = new URLSearchParams();
        params.append("level1", level1);
        params.append("level2", level2);
        params.append("service_contract", service_contract);

        return {
          url: `/api/v1/response-time/responsetime-history/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    getLast12Months: builder.query({
      query: ({ es_subscription_id }) => {
        const params = new URLSearchParams();

        return {
          url: `/api/v1/dashboard/last12months/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetResponseTimeQuery,
  useGetResponseTimeBuildingQuery,
  useGetResponseTimeSummaryBuildingQuery,
  useGetResponseHistoryQuery,
  useGetLast12MonthsQuery,
} = responseTimeApi;
