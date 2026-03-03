import React from "react";
import AdminServiceContractDeatilsCard from "../service-contract-details/card";
import dayjs from "dayjs";

function DetailsSkeleton() {
  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-8 animate-pulse">
      {/* Title skeleton */}
      <div className="h-7 w-72 bg-gray-200 rounded mb-6" />

      {/* Cards skeleton */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200">
            {/* Icon */}
            <div className="h-12 w-12 rounded-full bg-gray-200" />

            {/* Text */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-44 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ContractsDetails({ subscription, isLoading }) {
  if (isLoading) return <DetailsSkeleton />;
  if (!subscription) return null;

  const list = [
    {
      icon: "/assets/svg/es-contract-1.svg",
      icon_bg: "#1F98B226",
      title: "Subscription Number",
      label: subscription?.es_subscription_number,
    },
    {
      icon: "/assets/svg/es-contract-2.svg",
      icon_bg: "#F06B3C26",
      title: "Subscription Type",
      label: subscription?.subscription_type,
    },
    {
      icon: "/assets/svg/es-contract-3.svg",
      icon_bg: "#248EA526",
      title: "Start Date",
      label: dayjs(subscription?.start_date).format("DD-MM-YYYY"),
    },
    {
      icon: "/assets/svg/es-contract-4.svg",
      icon_bg: "#C2285A26",
      title: "End Date",
      label: dayjs(subscription?.end_date).format("DD-MM-YYYY"),
    },
    // {
    //   icon: "/assets/svg/es-contract-3.svg",
    //   icon_bg: "#248EA526",
    //   title: "Adjustment",
    //   label: subscription?.adjustment_per_year,
    // },
    // {
    //   icon: "/assets/svg/es-contract-4.svg",
    //   icon_bg: "#C2285A26",
    //   title: "Next Adjustment",
    //   label: dayjs(subscription?.next_adjustment_date).format("DD-MM-YYYY"),
    // },
  ];

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-8">
      <div className="flex items-center justify-between">
        <p className="text-2xl text-black font-semibold">
          Subscription Details
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {list.map((item, index) => (
          <AdminServiceContractDeatilsCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
