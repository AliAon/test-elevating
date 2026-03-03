import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const brandApi = createApi({
  reducerPath: "brandApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("ngrok-skip-browser-warning", "true");

      return headers;
    },
  }),
  tagTypes: ["Brand"],

  endpoints: (builder) => ({
    // ✅ Get all brands
    getAllBrands: builder.query({
      query: (params) => {
        const searchparams = new URLSearchParams(params).toString();
        return {
          url: `/api/v1/brand-products?${searchparams}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response.data,
      providesTags: ["Brand"],
    }),

    // ✅ Create new brand (updated for /brands endpoint with FormData)
    createBrand: builder.mutation({
      query: (formData) => ({
        url: `/api/v1/brands`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Brand"],
    }),

    // ✅ Update existing brand (now uses /brands/:id)
    updateBrand: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/v1/brands/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Brand"],
    }),

    // ✅ Delete brand
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/api/v1/brand-products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),

    getAllBrand: builder.query({
      query: ({ search, page, limit = 30 }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);

        return {
          url: `/api/v1/brands?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    // ✅ Get brands list from /brands
    getBrands: builder.query({
      query: () => ({
        url: `/api/v1/brands`,
        method: "GET",
      }),
      providesTags: ["Brand"],
    }),

    // ✅ Get brand details from /brands/:id
    getBrandDetails: builder.query({
      query: (id) => ({
        url: `/api/v1/brands/${id}`,
        method: "GET",
      }),
      providesTags: ["Brand"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetAllBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useGetAllBrandQuery,
  useGetBrandsQuery,
  useGetBrandDetailsQuery,
} = brandApi;
