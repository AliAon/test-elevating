import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const equipmentsApi = createApi({
  reducerPath: "equipmentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),
  tagTypes: ["Equipments"],
  endpoints: (builder) => ({
    getAccessibleEquipments: builder.query({
      query: ({
        es_subscription_id,
        page = 1,
        limit = 10,
        equipment_type = "all",
        level1 = "",
        level2 = "",
        level3 = "",
        service_contract = "",
        search_property = "",
        equipment_id = "",
        year = "",
      }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        params.append("equipment_type", equipment_type);
        params.append("level1", level1);
        params.append("level2", level2);
        params.append("level3", level3);
        params.append("service_contract", service_contract);
        if (search_property) params.append("search", search_property);
        if (equipment_id) params.append("equipment", equipment_id);
        if (year) params.append("year", year);
        return {
          url: `/api/v1/equipments/accessible/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Equipments"],
    }),
    getEquipmentsStats: builder.query({
      query: ({ es_subscription_id, level3 = "" }) => {
        const params = new URLSearchParams();

        params.append("building_id", level3);
        return {
          url: `/api/v1/equipments/stats/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Equipments"],
      transformResponse: (response) => response.data,
    }),
    getEquipmentsSplit: builder.query({
      query: ({
        es_subscription_id,
        level1 = "",
        level2 = "",
        level3 = "",
      }) => {
        const params = new URLSearchParams();
        params.append("level1", level1);
        params.append("level2", level2);
        params.append("level3", level3);
        return {
          url: `/api/v1/equipments/splits/${es_subscription_id}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Equipments"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetAccessibleEquipmentsQuery,
  useGetEquipmentsStatsQuery,
  useGetEquipmentsSplitQuery,
} = equipmentsApi;
