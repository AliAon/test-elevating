import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const callBacksApi = createApi({
  reducerPath: "callBacksApi",
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
  tagTypes: ["callBacks"],

  endpoints: (builder) => ({
    getCallBacksSummary: builder.query({
      query: ({ es_subscription_id, level1, level2, level3 }) => {
        const params = new URLSearchParams();
        if (level1) params.append("level1", level1);
        if (level2) params.append("level2", level2);
        if (level3) params.append("level3", level3);
        return {
          url: `/api/v1/callbacks/summary/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["callBacks"],
    }),
    getCallBacksFoucsEquipments: builder.query({
      query: ({ es_subscription_id, level1, level2, level3 }) => {
        const params = new URLSearchParams();
        if (level1) params.append("level1", level1);
        if (level2) params.append("level2", level2);
        if (level3) params.append("level3", level3);
        return {
          url: `/api/v1/callbacks/top-equipments/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["callBacks"],
    }),

    getCallbacksHistory: builder.query({
      query: ({
        search_property,
        level1,
        level2,
        level3,
        date_from,
        date_to,
        service_contract,
        equipmentType,
        buildingId,
        es_subscription_id,
        page,
        limit,
        status,
        equipment_id,
      }) => {
        const params = new URLSearchParams();
        if (search_property) params.append("search_property", search_property);
        if (level1) params.append("level1", level1);
        if (level2) params.append("level2", level2);
        if (level3) params.append("level3", level3);
        if (date_from) params.append("date_from", date_from);
        if (date_to) params.append("date_to", date_to);
        if (limit) params.append("limit", limit);
        if (service_contract)
          params.append("service_contract", service_contract);
        if (equipmentType) params.append("equipmentType", equipmentType);
        if (buildingId) params.append("buildingId", buildingId);
        if (page) params.append("page", page);
        if (status) params.append("status", status);
        if (equipment_id) params.append("equipment_id", equipment_id);

        return {
          url: `/api/v1/callbacks/history/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    // Same behavior as getCallbacksHistory but hits /all-history/ endpoint
    getCallbacksAllHistory: builder.query({
      query: ({
        search_property,
        level1,
        level2,
        level3,
        date_from,
        date_to,
        service_contract,
        equipmentType,
        buildingId,
        es_subscription_id,
        page,
        limit,
      }) => {
        const params = new URLSearchParams();
        if (search_property) params.append("search_property", search_property);
        if (level1) params.append("level1", level1);
        if (level2) params.append("level2", level2);
        if (level3) params.append("level3", level3);
        if (date_from) params.append("date_from", date_from);
        if (date_to) params.append("date_to", date_to);
        if (limit) params.append("limit", limit);
        if (service_contract)
          params.append("service_contract", service_contract);
        if (equipmentType) params.append("equipmentType", equipmentType);
        if (buildingId) params.append("buildingId", buildingId);
        if (page) params.append("page", page);

        return {
          url: `/api/v1/callbacks/all-history/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    getCallbacksHistoryById: builder.query({
      query: ({
        search_property,
        level1,
        level2,
        level3,
        date_from,
        date_to,
        service_contract,
        equipment_id,
        buildingId,
        id,
        status,
      }) => {
        const params = new URLSearchParams();
        if (search_property) params.append("search_property", search_property);
        if (level1) params.append("level1", level1);
        if (level2) params.append("level2", level2);
        if (level3) params.append("level3", level3);
        if (date_from) params.append("date_from", date_from);
        if (date_to) params.append("date_to", date_to);
        if (status) params.append("status", status);
        if (service_contract)
          params.append("service_contract", service_contract);
        if (equipment_id) params.append("equipment_id", equipment_id);
        if (buildingId) params.append("buildingId", buildingId);

        return {
          url: `/api/v1/callbacks/equipmentCallback/${id}?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    getCallbackById: builder.query({
      query: (id) => {
        return {
          url: `/api/v1/callbacks/detail/${id}`,
          method: "GET",
        };
      },
      providesTags: ["callBacks"],
    }),
    getCallbacksPerformace: builder.query({
      query: ({
        es_subscription_id,
        month,
        level1,
        level2,
        level3,
        service_contract,
      }) => {
        const params = new URLSearchParams();
        if (month) params.append("month", month);
        if (level1) params.append("level1", level1);
        if (level2) params.append("level2", level2);
        if (level3) params.append("level3", level3);
        if (service_contract)
          params.append("service_contract", service_contract);

        return {
          url: `/api/v1/callbacks/building-wise-performance/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    getCallbacksTrappedPessangerGraph: builder.query({
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
          url: `/api/v1/callbacks/trapped-passenger-graph/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    // Maintenance
    getMaintenanceSummaryQueryReport: builder.query({
      query: ({
        es_subscription_id,
        service_contract,
        equipmentType,
        buildingId,
        group_id,
        client_id,
        region,
        siteId,
        dateFrom,
        dateTo,
        oemId,
        jobType,
        status,
      }) => {
        const params = new URLSearchParams();
        if (equipmentType) params.append("equipmentType", equipmentType);
        if (buildingId) params.append("buildingId", buildingId);
        if (group_id) params.append("group_id", group_id);
        if (client_id) params.append("client_id", client_id);
        if (region) params.append("region", region);
        if (siteId) params.append("siteId", siteId);
        if (dateFrom) params.append("dateFrom", dateFrom);
        if (dateTo) params.append("dateTo", dateTo);
        if (oemId) params.append("oemId", oemId);
        if (jobType) params.append("jobType", jobType);
        if (service_contract)
          params.append("service_contract", service_contract);
        if (status) params.append("status", status);
        return {
          url: `/api/v1/callbacks/all/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["callBacks"],
    }),
    // Capital Budget
    getCapitalBudgetSummaryQueryReport: builder.query({
      query: ({
        es_subscription_id,
        service_contract,
        equipmentType,
        buildingId,
        group_id,
        client_id,
        region,
        siteId,
        dateFrom,
        dateTo,
        oemId,
        jobType,
        status,
      }) => {
        const params = new URLSearchParams();
        if (equipmentType) params.append("equipmentType", equipmentType);
        if (buildingId) params.append("buildingId", buildingId);
        if (group_id) params.append("group_id", group_id);
        if (client_id) params.append("client_id", client_id);
        if (region) params.append("region", region);
        if (siteId) params.append("siteId", siteId);
        if (dateFrom) params.append("dateFrom", dateFrom);
        if (dateTo) params.append("dateTo", dateTo);
        if (oemId) params.append("oemId", oemId);
        if (jobType) params.append("jobType", jobType);
        if (service_contract)
          params.append("service_contract", service_contract);
        if (status) params.append("status", status);
        return {
          url: `/api/v1/capital-budget/all/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["callBacks"],
    }),
    // Maintenance
    getKpiPenaltySummaryQueryReport: builder.query({
      query: ({
        service_contract,
        equipmentType,
        buildingId,
        group_id,
        client_id,
        region,
        siteId,
        dateFrom,
        dateTo,
        oemId,
        jobType,
        status,
      }) => {
        const params = new URLSearchParams();
        if (equipmentType) params.append("equipment_type", equipmentType);
        if (buildingId) params.append("buildingId", buildingId);
        if (group_id) params.append("group_id", group_id);
        if (client_id) params.append("client_id", client_id);
        if (region) params.append("region", region);
        if (siteId) params.append("siteId", siteId);
        if (dateFrom) params.append("dateFrom", dateFrom);
        if (dateTo) params.append("dateTo", dateTo);
        if (oemId) params.append("oemId", oemId);
        if (jobType) params.append("jobType", jobType);
        if (service_contract)
          params.append("service_contract", service_contract);
        if (status) params.append("status", status);
        return {
          url: `/api/v1/kpi-penalty/all-penalties?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["callBacks"],
    }),
    //Callbacks
    uploadCallbacksCsv: builder.mutation({
      query: ({ contractId, formData }) => ({
        url: `/api/v1/callbacks/upload/${contractId}`,
        method: "POST",
        body: formData,
      }),
    }),
    //Maintenance
    uploadMaintenanceCsv: builder.mutation({
      query: ({ contractId, formData }) => ({
        url: `/api/v1/maintenance/upload/${contractId}`,
        method: "POST",
        body: formData,
      }),
    }),
    //Callbacks Stats
    getCallbackDashboardStats: builder.query({
      query: ({ es_subscription_id }) => ({
        url: `/api/v1/callbacks/dashboard/${es_subscription_id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCallBacksSummaryQuery,
  useGetCallBacksFoucsEquipmentsQuery,
  useGetCallbackByIdQuery,
  useGetCallbacksHistoryQuery,
  useGetCallbacksAllHistoryQuery,
  useGetCallbacksHistoryByIdQuery,
  useGetCallbacksPerformaceQuery,
  useGetCallbacksTrappedPessangerGraphQuery,
  useGetMaintenanceSummaryQueryReportQuery,
  useLazyGetMaintenanceSummaryQueryReportQuery,
  useLazyGetCapitalBudgetSummaryQueryReportQuery,
  useGetKpiPenaltySummaryQueryReportQuery,
  useLazyGetKpiPenaltySummaryQueryReportQuery,
  useUploadCallbacksCsvMutation,
  useUploadMaintenanceCsvMutation,
  useGetCallbackDashboardStatsQuery,
} = callBacksApi;
