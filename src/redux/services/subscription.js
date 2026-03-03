import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
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
  tagTypes: ["Subscription", "Level1", "Level2", "Level3"],

  endpoints: (builder) => ({
    // Levels API (Create Levels Data)
    createLevel1: builder.mutation({
      query: (body) => {
        let finalBody = body;

        try {
          if (typeof window !== "undefined") {
            const searchParams = new URLSearchParams(window.location.search);
            const esSubscriptionId = searchParams.get("subscriptionId");

            if (esSubscriptionId && Array.isArray(body?.level1s)) {
              finalBody = {
                ...body,
                level1s: body.level1s.map((item) => ({
                  ...item,
                  es_subscription_id:
                    item.es_subscription_id || esSubscriptionId,
                })),
              };
            }
          }
        } catch (error) {
          // Ignore URL parsing errors and fall back to original body
          finalBody = body;
        }

        return {
          url: `/api/v1/level1/bulk`,
          method: "POST",
          body: finalBody,
        };
      },
      invalidatesTags: ["Level"],
    }),
    createLevel2: builder.mutation({
      query: (body) => {
        let finalBody = body;

        try {
          if (typeof window !== "undefined") {
            const searchParams = new URLSearchParams(window.location.search);
            const esSubscriptionId = searchParams.get("subscriptionId");

            if (esSubscriptionId && Array.isArray(body?.level2s)) {
              finalBody = {
                ...body,
                level2s: body.level2s.map((item) => ({
                  ...item,
                  es_subscription_id:
                    item.es_subscription_id || esSubscriptionId,
                })),
              };
            }
          }
        } catch (error) {
          finalBody = body;
        }

        return {
          url: `/api/v1/level2/bulk`,
          method: "POST",
          body: finalBody,
        };
      },
      invalidatesTags: ["Level"],
    }),
    createLevel3: builder.mutation({
      query: (body) => ({
        url: `/api/v1/buildings`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Level"],
    }),
    // Levels API(Update Levels Data)
    updateLevel1: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/v1/level1/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Level"],
    }),
    updateLevel2: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/v1/level2/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Level"],
    }),
    updateLevel3: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/v1/buildings/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Level"],
    }),
    updateLevelBuilding: builder.mutation({
      query: ({ parent_level_id, es_subscription_id, building_id }) => ({
        url: `/api/v1/buildings/${building_id}`,
        method: "PUT",
        body: { parent_level_id, es_subscription_id },
      }),
      invalidatesTags: ["Level"],
    }),
    getLevel3: builder.query({
      query: (id) => ({
        url: `/api/v1/buildings/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Level"],
    }),
    // Levels API(Get Levels Data)
    getLvl1BySubscriptionId: builder.query({
      query: ({ subscriptionId, client_id }) => {
        const params = new URLSearchParams();
        if (subscriptionId && subscriptionId != "all")
          params.append("es_subscription_id", subscriptionId);
        if (client_id) params.append("client_id", client_id);
        return {
          url: `/api/v1/level1?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Level"],
    }),
    getLvl2BySubscriptionId: builder.query({
      query: ({ subscriptionId, parentId, client_id }) => {
        const params = new URLSearchParams();
        if (subscriptionId && subscriptionId != "all")
          params.append("es_subscription_id", subscriptionId);
        if (parentId && parentId != "all")
          params.append("parent_level_id", parentId);
        if (client_id) params.append("client_id", client_id);

        return {
          url: `/api/v1/level2?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Level"],
    }),

    getLvl3BySubscriptionId: builder.query({
      query: ({ subscriptionId, parentId, clientId, search }) => {
        const params = new URLSearchParams();
        if (subscriptionId && subscriptionId != "all")
          params.append("es_subscription_id", subscriptionId);
        if (parentId && parentId != "all")
          params.append("parent_level_id", parentId);
        if (clientId) params.append("clientId", clientId);
        if (search) params.append("search", search);

        return {
          url: `/api/v1/buildings?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Level"],
    }),
    getLvl3List: builder.query({
      query: ({ search, page, limit, clientId, es_subscription_id }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (clientId) params.append("clientId", clientId);
        if (es_subscription_id && es_subscription_id != "all")
          params.append("es_subscription_id", es_subscription_id);
        return {
          url: `/api/v1/buildings?${params?.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Level"],
    }),

    // Subscriptions Api
    createSubscription: builder.mutation({
      query: (body) => ({
        url: `/api/v1/subscriptions`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Subscription"],
    }),
    updateSubscription: builder.mutation({
      query: ({ values, subscriptionId }) => {
        return {
          url: `/api/v1/subscriptions/${subscriptionId}`,
          method: "PUT",
          body: values,
        };
      },
      invalidatesTags: ["Subscription"],
    }),
    getSubscriptionByClientId: builder.query({
      query: (id) => ({
        url: `/api/v1/subscriptions?clientId=${id}`,
        method: "GET",
      }),
    }),
    getSubscriptionById: builder.query({
      query: (id) => ({
        url: `/api/v1/subscriptions/${id}`,
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
    getSubscriptions: builder.query({
      query: ({ search, page, limit = 30, clientId, subscription_type }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (clientId) params.append("clientId", clientId);
        if (subscription_type)
          params.append("subscription_type", subscription_type);

        return {
          url: `/api/v1/subscriptions?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Subscription"],
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useCreateLevel1Mutation,
  useCreateLevel2Mutation,
  useCreateLevel3Mutation,
  useUpdateLevel1Mutation,
  useUpdateLevel2Mutation,
  useUpdateLevel3Mutation,
  useUpdateLevelBuildingMutation,
  useGetLvl1BySubscriptionIdQuery,
  useGetLvl2BySubscriptionIdQuery,
  useGetLvl3BySubscriptionIdQuery,
  useUpdateSubscriptionMutation,
  useGetSubscriptionByClientIdQuery,
  useLazyGetSubscriptionByClientIdQuery,
  useGetSubscriptionByIdQuery,
  useGetSubscriptionsQuery,
  useGetLvl3ListQuery,
  useGetLevel3Query,
  useLazyGetLvl1BySubscriptionIdQuery,
  useLazyGetLvl2BySubscriptionIdQuery,
  useLazyGetLvl3BySubscriptionIdQuery,
  useLazyGetLvl3ListQuery,
} = subscriptionApi;
