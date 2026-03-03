import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const capitalBugetApi = createApi({
  reducerPath: "capitalBugetApi",
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
    getSummary: builder.query({
      query: ({
        es_subscription_id,
        level1,
        level2,
        level3,
        equiment_type,
      }) => {
        const params = new URLSearchParams();
        if (level1) params.append("level1", level1);
        if (level2) params.append("level2", level2);
        if (level3) params.append("level3", level3);
        if (equiment_type) params.append("equipment_type", equiment_type);
        return {
          url: `/api/v1/capital-budget/summary/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["capitalBudget"],
    }),
    getSummaryYearly: builder.query({
      query: ({ es_subscription_id, year, level1, level2, level3 }) => {
        const params = new URLSearchParams();
        if (level1) params.append("level1", level1);
        if (level2) params.append("level2", level2);
        if (level3) params.append("level3", level3);
        return {
          url: `/api/v1/capital-budget/monthwise/${es_subscription_id}/${year}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["capitalBudget"],
    }),
    getEquipmentSummaryYearly: builder.query({
      query: ({ es_subscription_id, year }) => {
        return {
          url: `/api/v1/capital-budget/replacements/${es_subscription_id}?year=${year}`,
          method: "GET",
        };
      },
      providesTags: ["capitalBudget"],
    }),
    getEquipmentsAccessible: builder.query({
      query: ({
        search,
        page,
        limit = 30,
        equipmentType,
        buildingId,
        es_subscription_id,
      }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (equipmentType) params.append("equipmentType", equipmentType);
        if (buildingId) params.append("buildingId", buildingId);

        return {
          url: `/api/v1/equipments/accessible/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    getsAccess: builder.query({
      query: ({ es_subscription_id }) => {
        const params = new URLSearchParams();
        if (es_subscription_id)
          params.append("es_subscription_id", es_subscription_id);

        return {
          url: `/api/v1/accesses?es_subscription_id=${es_subscription_id}`,
          method: "GET",
        };
      },
    }),
    getCapitalDistribution: builder.query({
      query: ({ es_subscription_id, equiment_type }) => {
        const params = new URLSearchParams();
        if (equiment_type) params.append("equipment_type", equiment_type);

        return {
          url: `/api/v1/equipments/life/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetSummaryQuery,
  useGetSummaryYearlyQuery,
  useGetEquipmentsAccessibleQuery,
  useGetsAccessQuery,
  useGetCapitalDistributionQuery,
  useGetEquipmentSummaryYearlyQuery,
} = capitalBugetApi;
