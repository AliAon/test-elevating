import MaintenanceHistory from "@/components/maintenance/maintenance-history";
import React from "react";
import { useParams } from "react-router-dom";
import {
  useGetMaintenanceDetailsQuery,
  useGetMaintenanceHistoryStatsQuery,
} from "@/redux/services/maintenance";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

export default function PlannedMaintenance() {
  const { id } = useParams();
  const { equipment_id } = useParams();
  const { data, isLoading, isError } = useGetMaintenanceDetailsQuery(id);
  const { data: stats } = useGetMaintenanceHistoryStatsQuery({
    es_subscription_id: id,
    equipment_id,
  });
  const details = data?.data;
  const statistics_list = [
    {
      icon: "/assets/svg/maint-7.svg",
      icon_bg: "#248EA526",
      title: "Maintenance Done",
      value: stats?.maintenance_done_last_12_months,
      extra_label: "",
      des: "in last 12 months",
    },
    {
      icon: "/assets/svg/maint-5.svg",
      icon_bg: "#B468B926",
      title: "Maintenance Performance",
      value: `${stats?.maintenance_performance_pct}%`,
      extra_label: "",
      des: "Annual Performance (Average)",
    },
    {
      icon: "/assets/svg/maint-8.svg",
      icon_bg: "#C2285A26",
      title: "Callbacks",
      value: stats?.callbacks_last_12_months,
      extra_label: "",
      des: "in last 12 months",
    },
    {
      icon: "/assets/svg/maint-9.svg",
      icon_bg: "#1F98B226",
      title: "Average Response Time",
      value: `${stats?.average_response_time}`,
      extra_label: "",
      des: "per month average",
    },
  ];
  const list = [
    {
      item: "Maintenance",
      link: "/maintenance-overview",
    },
    {
      item: "Maintenance Details",
      link: "#",
    },
  ];

  return (
    <div>
      <Breadcrumbs list={list} />

      <p className="text-3xl text-text_primary font-semibold mb-2">
        Maintenance Details
      </p>
      {/* Group > Equipment (Model - Design) */}
      {details && details.group && details.equipment && (
        <p className="text-base text-gray-600 font-medium mb-4">
          {details.group.groupname} &gt; {details.equipment.equipment_name}
          {" ["}
          {details.equipment.model_number || "-"}
          {" - "}
          {details.equipment.design_code || "-"}
          {"]"}
        </p>
      )}

      {/* Maintenance Details Section */}
      <div className="bg-white border border-gray-100 rounded-lg p-6 mb-5 shadow-sm">
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-6 w-1/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/4 bg-gray-100 rounded" />
            <div className="h-4 w-1/2 bg-gray-100 rounded" />
            <div className="h-4 w-1/5 bg-gray-100 rounded" />
          </div>
        ) : isError ? (
          <div className="text-red-500">
            Failed to load maintenance details.
          </div>
        ) : details ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                Equipment Type
              </p>
              <p className="text-sm text-gray-900 font-semibold">
                {details.equipment?.equipment_type || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                Job Type
              </p>
              <p className="text-sm text-gray-900 font-semibold">
                {details.jobType ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                Visit Type
              </p>
              <p className="text-sm text-gray-900 font-semibold">
                {details?.callback_data?.maintenance?.visitType ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                Job Status
              </p>
              <p className="text-sm text-gray-900 font-semibold">
                {details.callback_data?.maintenance?.jobStatus || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                Job Date
              </p>
              <p className="text-sm text-gray-900 font-semibold">
                {details.callback_data?.jobDate
                  ? new Date(details.callback_data.jobDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                Planned Date
              </p>
              <p className="text-sm text-gray-900 font-semibold">
                {details.callback_data?.maintenance?.plannedDate
                  ? new Date(
                      details.callback_data.maintenance.plannedDate,
                    ).toLocaleDateString()
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                Job Number
              </p>
              <p className="text-sm text-gray-900 font-semibold">
                {details.callback_data?.jobNumber || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                Purchase Order Number
              </p>
              <p className="text-sm text-gray-900 font-semibold">
                {details.callback_data?.purchaseOrderNumber || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                Technician Comments
              </p>
              <p className="text-sm text-gray-900 font-semibold">
                {details?.description || "-"}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-4 gap-3 mt-5">
        {statistics_list.map((item, index) => (
          <StatisticsCard key={index} item={item} />
        ))}
      </div>

      {/* Pass equipment_id to MaintenanceHistory if available */}
      {equipment_id ? (
        <MaintenanceHistory equipment_id={equipment_id} />
      ) : (
        <MaintenanceHistory />
      )}
    </div>
  );
}

const StatisticsCard = ({ item }) => {
  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 shadow-sm rounded-xl px-4 py-4">
      <div
        className="w-10 h-10 flex items-center justify-center rounded-full"
        style={{
          background: item.icon_bg,
        }}
      >
        <img src={item.icon} alt="" width={24} height={24} />
      </div>

      <div className="space-y-0.5">
        <p className="text-sm text-text_primary font-medium">{item.title}</p>
        <div className="flex items-center gap-1">
          <p className="text-2xl text-text_primary font-semibold">
            {item.value}
          </p>
          {item.extra_label && (
            <>
              <p className="text-xl text-[#898EA6] font-semibold">/</p>
              <p className="text-xl text-[#C2285A] font-semibold">
                {item.extra_label}
              </p>
            </>
          )}
        </div>
        {item.des && (
          <p className="text-xs text-text_secondary font-medium">{item.des}</p>
        )}
      </div>
    </div>
  );
};
