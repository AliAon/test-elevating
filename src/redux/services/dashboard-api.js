import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
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
  tagTypes: ["capitalBudget"],

  endpoints: (builder) => ({
    getClientDashboardStates: builder.query({
      query: ({
        es_subscription_id,
        level1 = "all",
        level2 = "all",
        level3 = "all",
        service_contract = "all",
      }) => {
        const params = new URLSearchParams();
        params.append("level1", level1);
        params.append("level2", level2);
        params.append("level3", level3);
        params.append("service_contract", service_contract);
        return {
          url: `/api/v1/dashboard/stats/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["capitalBudget"],
    }),
    getDashboardStats: builder.query({
      query: () => {
        return {
          url: `/api/v1/dashboard/dashboard`,
          method: "GET",
        };
      },
      providesTags: ["capitalBudget"],
      transformResponse: (response) => response.data,
    }),

    getClientDashboardCallbacks: builder.query({
      query: ({
        es_subscription_id,
        level1 = "all",
        level2 = "all",
        level3 = "all",
        service_contract = "all",
        tab,
      }) => {
        const params = new URLSearchParams();
        if (level1) params.append("level1", level1);
        if (level2) params.append("level2", level2);
        if (level3) params.append("level3", level3);
        if (service_contract)
          params.append("service_contract", service_contract);
        if (tab) params.append("tab", tab);
        return {
          url: `/api/v1/dashboard/callbacks/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["capitalBudget"],
    }),
    getClientGraphCallbacks: builder.query({
      query: ({
        es_subscription_id,
        level1 = "all",
        level2 = "all",
        level3 = "all",
        service_contract = "all",
        tab,
      }) => {
        const params = new URLSearchParams();
        if (level1) params.append("level1", level1);
        if (level2) params.append("level2", level2);
        if (level3) params.append("level3", level3);
        if (service_contract)
          params.append("service_contract", service_contract);
        if (tab) params.append("tab", tab);
        return {
          url: `/api/v1/dashboard/callback-graph/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["capitalBudget"],
    }),
    getClientDashboardFoucs: builder.query({
      query: ({
        es_subscription_id,
        level1 = "all",
        level2 = "all",
        level3 = "all",
        service_contract = "all",
      }) => {
        const params = new URLSearchParams();
        params.append("level1", level1);
        params.append("level2", level2);
        params.append("level3", level3);
        params.append("service_contract", service_contract);
        return {
          url: `/api/v1/dashboard/callback-graph-by-equipment/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["capitalBudget"],
    }),
    getClientDashboardAvgResponse: builder.query({
      query: ({
        es_subscription_id,
        level1 = "all",
        level2 = "all",
        level3 = "all",
        service_contract = "all",
      }) => {
        const params = new URLSearchParams();
        params.append("level1", level1);
        params.append("level2", level2);
        params.append("level3", level3);
        params.append("service_contract", service_contract);
        return {
          url: `/api/v1/dashboard/avg-response-time/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["capitalBudget"],
    }),
    getClientDashboardAvailbilityResponse: builder.query({
      query: ({
        es_subscription_id,
        level1 = "all",
        level2 = "all",
        level3 = "all",
        service_contract = "all",
      }) => {
        const params = new URLSearchParams();
        params.append("level1", level1);
        params.append("level2", level2);
        params.append("level3", level3);
        params.append("service_contract", service_contract);
        return {
          url: `/api/v1/dashboard/12-month-availability/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["capitalBudget"],
    }),
    getClientDashboardMonthlyMaintenance: builder.query({
      query: ({
        es_subscription_id,
        level1 = "all",
        level2 = "all",
        level3 = "all",
        service_contract = "all",
        tab = "monthly",
      }) => {
        const params = new URLSearchParams();
        params.append("level1", level1);
        params.append("level2", level2);
        params.append("level3", level3);
        params.append("service_contract", service_contract);
        params.append("tab", tab);
        return {
          url: `/api/v1/dashboard/monthly-maintenance-percentage/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["capitalBudget"],
    }),
    getKpiPenaltyDashboard: builder.query({
      query: ({
        es_subscription_id,
        level1 = "all",
        level2 = "all",
        level3 = "all",
        service_contract = "all",
        page = 1,
        date_from = "",
        date_to = "",
        property = "",
        equipment_id = "",
      }) => {
        const params = new URLSearchParams();
        params.append("level1", level1);
        params.append("level2", level2);
        params.append("level3", level3);
        params.append("service_contract", service_contract);
        params.append("page", page);
        if (date_from) params.append("date_from", date_from);
        if (date_to) params.append("date_to", date_to);
        if (property) params.append("property", property);
        if (equipment_id) params.append("equipment_id", equipment_id);
        return {
          url: `/api/v1/kpi-penalty/stats/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["capitalBudget"],
      transformResponse: (response) => response.data,
    }),
    getKpiPenaltySelectedMonth: builder.query({
      query: ({
        es_subscription_id,
        level1 = "all",
        level2 = "all",
        level3 = "all",
        // service_contract = "all",
        month = "all",
        page = 1,
        date_from = "",
        date_to = "",
        property = "",
        equipment_id = "",
      }) => {
        const params = new URLSearchParams();
        params.append("level1", level1);
        params.append("level2", level2);
        params.append("level3", level3);
        params.append("month", month);
        params.append("page", page);
        if (date_from) params.append("date_from", date_from);
        if (date_to) params.append("date_to", date_to);
        if (property) params.append("property", property);
        if (equipment_id) params.append("equipment_id", equipment_id);

        return {
          url: `/api/v1/kpi-penalty/monthly-stats/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["capitalBudget"],
    }),
    getKpiPenaltySelectedBuilding: builder.query({
      query: ({
        es_subscription_id,
        level1 = "all",
        level2 = "all",
        level3 = "all",
        service_contract = "all",
        month = "all",
      }) => {
        const params = new URLSearchParams();
        params.append("level1", level1);
        params.append("level2", level2);
        params.append("level3", level3);
        params.append("service_contract", service_contract);
        params.append("month", month);
        return {
          url: `/api/v1/kpi-penalty/building-stats/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },

      providesTags: ["capitalBudget"],
    }),
    getKpiPenaltySelectedBuildingGraphData: builder.query({
      query: ({
        es_subscription_id,
        level1 = "all",
        level2 = "all",
        level3 = "all",
        service_contract = "all",
        tab = "monthly",
      }) => {
        const params = new URLSearchParams();
        if (level1) params.append("level1", level1);
        if (level2) params.append("level2", level2);
        if (level3) params.append("level3", level3);
        if (service_contract)
          params.append("service_contract", service_contract);
        if (tab) params.append("tab", tab);

        return {
          url: `/api/v1/kpi-penalty/building-graph-data/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["capitalBudget"],
      transformResponse: (response) => response.data,
    }),
    getKpiPenaltySelectedEquipmentStats: builder.query({
      query: ({
        es_subscription_id,
        equipment_id = "",
        level3 = "",
        level2 = "all",
        level1 = "all",
        page = 1,
      }) => {
        const params = new URLSearchParams();
        params.append("equipment_id", equipment_id);
        params.append("level2", level2);
        params.append("level1", level1);
        params.append("level3", level3);
        params.append("page", page);

        return {
          url: `/api/v1/kpi-penalty/equipment-stats/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["capitalBudget"],
    }),
    getAverageTime: builder.query({
      query: () => ({
        url: `/api/v1/user-sessions/time`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getDashboardClientsStats: builder.query({
      query: () => {
        return {
          url: `/api/v1/dashboard/client`,
          method: "GET",
        };
      },
      providesTags: ["capitalBudget"],
      transformResponse: (response) => response,
    }),
    getDashboardAdminStats: builder.query({
      query: () => {
        return {
          url: `/api/v1/dashboard/admin`,
          method: "GET",
        };
      },
      providesTags: ["capitalBudget"],
    }),
  }),
});

export const {
  useGetClientDashboardStatesQuery,
  useGetClientDashboardCallbacksQuery,
  useGetClientDashboardFoucsQuery,
  useGetClientDashboardAvgResponseQuery,
  useGetClientDashboardAvailbilityResponseQuery,
  useGetClientDashboardMonthlyMaintenanceQuery,
  useGetKpiPenaltyDashboardQuery,
  useGetKpiPenaltySelectedMonthQuery,
  useGetKpiPenaltySelectedBuildingQuery,
  useGetKpiPenaltySelectedBuildingGraphDataQuery,
  useGetKpiPenaltySelectedEquipmentStatsQuery,
  useGetDashboardStatsQuery,
  useGetAverageTimeQuery,
  useGetDashboardClientsStatsQuery,
  useGetDashboardAdminStatsQuery,
  useGetClientGraphCallbacksQuery,
} = dashboardApi;
