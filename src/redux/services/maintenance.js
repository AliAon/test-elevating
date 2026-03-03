import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const maintenanceApi = createApi({
  reducerPath: "maintenanceApi",
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
  tagTypes: ["maintenance"],

  endpoints: (builder) => ({
    getMaintenanceDetails: builder.query({
      query: (maintenance_id) => ({
        url: `/api/v1/maintenance/details/${maintenance_id}`,
        method: "GET",
      }),
      providesTags: ["maintenance"],
    }),
    getMaintenanceSummary: builder.query({
      query: ({
        es_subscription_id,
        level1,
        level2,
        level3,
        service_contract,
      }) => {
        const params = new URLSearchParams();
        if (level1) params.append("level1", level1);
        if (level2) params.append("level2", level2);
        if (level3) params.append("level3", level3);
        if (service_contract)
          params.append("service_contract", service_contract);
        return {
          url: `/api/v1/maintenance/summary/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["maintenance"],
    }),
    getMaintenanceHistory: builder.query({
      query: ({
        es_subscription_id,
        date_from,
        date_to,
        search_property,
        equipment_id,
        page,
        status,
      }) => {
        const params = new URLSearchParams();
        if (date_from) params.append("date_from", date_from);
        if (date_to) params.append("date_to", date_to);
        if (search_property) params.append("search_property", search_property);
        if (equipment_id) params.append("equipment_id", equipment_id);
        if (page) params.append("page", page);
        if (status) params.append("status", status);

        return {
          url: `/api/v1/maintenance/history/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["maintenance"],
    }),
    getMaintenanceHistoryStats: builder.query({
      query: ({ es_subscription_id, equipment_id }) => {
        const params = new URLSearchParams();
        if (equipment_id) params.append("equipment_id", equipment_id);
        return {
          url: `/api/v1/maintenance/stats/history/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["maintenance"],
      transformResponse: (response) => response.data,
    }),

    getMaintenanceMonthly: builder.query({
      query: ({
        es_subscription_id,
        date_from,
        date_to,
        service_contract,
        month,
      }) => {
        const params = new URLSearchParams();
        if (month) params.append("month", month);
        if (date_from) params.append("date_from", date_from);
        if (date_to) params.append("date_to", date_to);
        if (service_contract)
          params.append("search_property", service_contract);
        return {
          url: `/api/v1/maintenance/building-wise-performance/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["maintenance"],
    }),
    getYtdMaintenance: builder.query({
      query: ({ es_subscription_id, level1, level2, level3, building_id }) => {
        const params = new URLSearchParams();
        if (level1) params.append("level1", level1);
        if (level2) params.append("level2", level2);
        if (level3) params.append("level3", level3);
        if (building_id) params.append("building_id", building_id);
        return {
          url: `/api/v1/maintenance/ytd-performance-by-building/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["maintenance"],
    }),
    getMaintainceBuilingStats: builder.query({
      query: ({ es_subscription_id }) => {
        const params = new URLSearchParams();
        return {
          url: `/api/v1/maintenance/building-stats/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["maintenance"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetMaintenanceSummaryQuery,
  useGetMaintenanceHistoryQuery,
  useGetMaintenanceMonthlyQuery,
  useGetMaintenanceDetailsQuery,
  useGetYtdMaintenanceQuery,
  useGetMaintenanceHistoryStatsQuery,
  useGetMaintainceBuilingStatsQuery,
} = maintenanceApi;
