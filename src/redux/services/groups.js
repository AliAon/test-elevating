import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const groupsApi = createApi({
  reducerPath: "groupsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),
  tagTypes: ["Group"],

  endpoints: (builder) => ({
    // groups
    createGroup: builder.mutation({
      query: (body) => ({
        url: "/api/v1/groups",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Group"],
    }),

    // equipments
    createEquipment: builder.mutation({
      query: (body) => ({
        url: "/api/v1/equipments/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Group"],
    }),

    addEquipment: builder.mutation({
      query: (body) => ({
        url: "/api/v1/equipments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Group"],
    }),

    getAllGroups: builder.query({
      query: ({
        search,
        building_id,
        page,
        limit = 100,
        client_id,
        es_subscription_id,
        service_contract_id,
      }) => {
        const params = new URLSearchParams();
        if (building_id) params.append("building_id", building_id);
        if (search) params.append("search", search);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (client_id) params.append("client_id", client_id);
        if (service_contract_id)
          params.append("service_contract_id", service_contract_id);
        if (es_subscription_id)
          params.append("es_subscription_id", es_subscription_id);

        return {
          url: `/api/v1/groups?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Group"],
    }),
    getGroupsByBuildingId: builder.query({
      query: ({ building_id }) => {
        const params = new URLSearchParams();
        if (building_id) params.append("building_id", building_id);

        return {
          url: `/api/v1/groups?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Group"],
    }),
    getGroupById: builder.query({
      query: (id) => {
        return {
          url: `/api/v1/groups/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Group"],
    }),

    getAllEquipments: builder.query({
      query: ({
        search,
        page,
        limit = 100,
        equipmentType,
        buildingId,
        group_id,
        client_id,
        region,
        siteId,
        dateFrom,
        dateTo,
        oemId,
      }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (equipmentType) params.append("equipmentType", equipmentType);
        if (buildingId) params.append("buildingId", buildingId);
        if (group_id) params.append("group_id", group_id);
        if (client_id) params.append("client_id", client_id);
        if (region) params.append("region", region);
        if (siteId) params.append("siteId", siteId);
        if (dateFrom) params.append("dateFrom", dateFrom);
        if (dateTo) params.append("dateTo", dateTo);
        if (oemId) params.append("oemId", oemId);

        return {
          url: `/api/v1/equipments?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    getEquipmentById: builder.query({
      query: (id) => {
        return {
          url: `/api/v1/equipments/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Group"],
    }),
    updateEquipment: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/v1/equipments/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Group"],
    }),
    updateBulk: builder.mutation({
      query: (body) => ({
        url: `/api/v1/equipments/bulk`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Group"],
    }),

    createGroupWithEquipmentsBulk: builder.mutation({
      query: (body) => ({
        url: "/api/v1/groups/bulk-with-equipment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Group"],
    }),
    UpdateGroupWithEquipmentsBulk: builder.mutation({
      query: (body) => ({
        url: "/api/v1/groups/bulk-with-equipment",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Group"],
    }),

    updateGroup: builder.mutation({
      query: (body) => {
        return {
          url: `/api/v1/groups/${body.group_id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Group"],
    }),
    updateCapitalBudget: builder.mutation({
      query: ({ body, id }) => ({
        url: `/api/v1/equipments/${id}/capital-budget`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Group"],
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useCreateEquipmentMutation,
  useAddEquipmentMutation,
  useGetAllGroupsQuery,
  useGetGroupsByBuildingIdQuery,
  useGetGroupByIdQuery,
  useGetAllEquipmentsQuery,
  useLazyGetAllEquipmentsQuery,
  useGetEquipmentByIdQuery,
  useLazyGetEquipmentByIdQuery,
  useUpdateEquipmentMutation,
  useUpdateBulkMutation,
  useCreateGroupWithEquipmentsBulkMutation,
  useUpdateGroupWithEquipmentsBulkMutation,
  useUpdateGroupMutation,
  useUpdateCapitalBudgetMutation,
} = groupsApi;
