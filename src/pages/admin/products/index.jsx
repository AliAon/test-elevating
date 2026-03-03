import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetBrandsQuery } from "@/redux/services/brand-api";
import { Skeleton } from "@/components/ui/skeleton"; // <- ensure you have this component
import { SearchBar } from "@/components/common/search-bar";
import Paginate from "@/components/common/paginate";

export default function Products() {
  const [page, setPage] = useState(1);
  const { data: brandsData, isLoading, isFetching } = useGetBrandsQuery();

  const brand_products = brandsData?.data?.brands ?? [];
  const pagination = brandsData?.data?.pagination ?? {};

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      {/* Header */}
      <div className="lg:flex items-center justify-between">
        <p className="text-2xl text-text_primary font-semibold">Brands</p>
        <SearchBar />
      </div>

      {/* Cards */}
      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        {isLoading || isFetching ? (
          Array.from({ length: 6 }).map((_, i) => <CostCardSkeleton key={i} />)
        ) : brand_products.length > 0 ? (
          brand_products.map((brand) => (
            <CostCard key={brand.id} company={brand} />
          ))
        ) : (
          <p className="text-center col-span-2 text-gray-500 font-medium py-8">
            No brands found.
          </p>
        )}
      </div>

      <div className="py-4">
        <Paginate
          totalPages={pagination.totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

/* --- Brand Card --- */
function CostCard({ company }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/admin/brand-details?product_id=${company.id}`)}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <img
            src={company.logo_url}
            alt={company.brand_name}
            className="w-14 h-14 object-contain rounded-lg border border-gray-100 bg-gray-50 p-2"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
            {company.brand_name}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">Brand Details</p>
        </div>
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* --- Skeleton Loader --- */
function CostCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-14 h-14 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="w-5 h-5 rounded flex-shrink-0" />
      </div>
    </div>
  );
}
