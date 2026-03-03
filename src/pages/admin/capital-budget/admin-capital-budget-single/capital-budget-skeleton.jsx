import React from "react";

export default function AdminCapitalBudgetSingleSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-start gap-5">
        {/* Image placeholder */}
        <div className="w-[328px] h-[530px] rounded-2xl border border-[#EAECEF] bg-bg_primary flex items-center justify-center">
          <div className="w-[85%] h-[85%] bg-gray-200 rounded-xl" />
        </div>

        {/* Right column */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            {/* Title + meta */}
            <div className="space-y-3 w-full max-w-[740px]">
              <div className="h-9 w-3/5 bg-gray-200 rounded-md" />
              <div className="flex items-center gap-2">
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
                <div className="h-4 w-2/3 bg-gray-200 rounded-md" />
              </div>
            </div>

            {/* Button placeholder */}
            <div className="w-44 h-10 bg-gray-200 rounded-full" />
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </div>

          {/* Details */}
          <div className="space-y-2 mt-5">
            <div className="grid grid-cols-2 gap-2">
              <SkeletonDetailCard />
              <SkeletonDetailCard />
            </div>
            <SkeletonDetailCard />
            <div className="h-24 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Condition & Advisory Notes */}
      <div className="bg-bg_primary rounded-xl p-6">
        <div className="h-8 w-1/3 bg-gray-200 rounded-md" />

        <div className="grid grid-cols-2 gap-2 mt-8">
          <SkeletonConditionCard />
          <SkeletonConditionCard />
        </div>
        <div className="mt-2">
          <SkeletonConditionCard large />
        </div>
      </div>

      {/* CapitalBudget placeholder */}
      <div className="bg-bg_primary rounded-xl p-6">
        <div className="h-8 w-1/3 bg-gray-200 rounded-md" />
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="h-40 bg-gray-200 rounded-2xl" />
          <div className="h-40 bg-gray-200 rounded-2xl" />
          <div className="h-40 bg-gray-200 rounded-2xl" />
        </div>
      </div>

      {/* Contract Information */}
      <div className="bg-bg_primary rounded-xl p-6">
        <div className="h-8 w-1/3 bg-gray-200 rounded-md" />

        <div className="grid grid-cols-3 gap-2 mt-8">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonStatCard() {
  return (
    <div className="bg-[#F6F6F8] rounded-2xl p-4 flex flex-col gap-3">
      <div className="h-8 w-12 bg-gray-200 rounded-md" />
      <div className="h-5 w-3/4 bg-gray-200 rounded-md" />
      <div className="h-4 w-1/2 bg-gray-200 rounded-md" />
    </div>
  );
}

function SkeletonDetailCard() {
  return (
    <div className="bg-bg_primary rounded-2xl p-4">
      <div className="h-4 w-1/3 bg-gray-200 rounded-md" />
      <div className="h-5 w-2/3 bg-gray-200 rounded-md mt-2" />
    </div>
  );
}

function SkeletonConditionCard({ large = false }) {
  return (
    <div className={`bg-white rounded-2xl p-4 ${large ? "h-28" : "h-20"}`}>
      <div className="h-4 w-1/3 bg-gray-200 rounded-md" />
      <div className="h-4 w-full bg-gray-200 rounded-md mt-3" />
      <div className="h-4 w-4/6 bg-gray-200 rounded-md mt-2" />
    </div>
  );
}
