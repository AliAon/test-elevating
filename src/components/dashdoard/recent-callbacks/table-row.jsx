import { ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

export default function RecentRow({ item }) {
  const {
    id,
    property_name,
    equipment_name,
    stopped_date,
    description,
    job_date,
    solve_date,
    detailed_info,
    unique_servie_id,
  } = item || {};

  const effectiveStatus = item?.status ?? item?.jobStatus ?? "Open";

  const jobTypeRaw =
    detailed_info?.jobType || detailed_info?.callback_data?.jobType || "";
  const jobType = jobTypeRaw?.toString()?.toLowerCase() || "";

  const getBadgeClass = (type) => {
    if (!type) return "bg-gray-100 text-gray-700";
    if (type.includes("maintenance")) return "bg-cyan-100 text-cyan-800";
    if (type.includes("repair") || type.includes("repaire"))
      return "bg-red-100 text-red-700";
    if (type.includes("callback")) return "bg-orange-100 text-orange-700";
    return "bg-gray-100 text-gray-700";
  };

  // Calculate response time for Schindler (arrivalDateTime - jobDate)
  let responseTime = null;
  let arrivalDate = null;
  if (item?.detailed_info?.service_provider_brand === "Schindler") {
    let jobDate = item?.stopped_date
      ? item.stopped_date
      : item?.detailed_info?.callback_data?.jobDate
        ? item.detailed_info.callback_data.jobDate
        : null;
    arrivalDate = item?.detailed_info?.callback_data?.callback?.arrivalDateTime
      ? item.detailed_info.callback_data.callback.arrivalDateTime
      : item?.solve_date
        ? item.solve_date
        : null;
    if (jobDate && arrivalDate) {
      const start = dayjs(jobDate);
      const end = dayjs(arrivalDate);
      const diff = end.diff(start, "minute");
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      responseTime = `${hours}h ${minutes}m`;
    }
  }

  return (
    <Link
      to={`/callbacks-details/${id}`}
      className="w-full flex items-center justify-between bg-white rounded-lg p-4 transition-colors duration-200 hover:bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm cursor-pointer group"
      tabIndex={0}
      aria-label={`View details for ${equipment_name || "incident"}`}
    >
      <div className="w-[192px] flex flex-col gap-1">
        <div>
          {jobTypeRaw ? (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium w-fit ${getBadgeClass(jobType)}`}
            >
              {jobTypeRaw?.toString()?.charAt(0).toUpperCase() +
                jobTypeRaw?.toString()?.slice(1)}
            </span>
          ) : null}
          <span className="ml-2 uppercase text-xs text-text_secondary">
            {unique_servie_id}
          </span>
        </div>
        <p className="text-sm text-[#060606] font-semibold">
          {job_date ? dayjs(job_date).format("DD MMM YYYY, HH:mm") : "N/A"}
        </p>
      </div>

      <div className="w-[192px] space-y-0">
        <p className="text-sm font-semibold text-text_secondary group-hover:text-primary">
          {equipment_name || "N/A"}
        </p>
        <p className="text-xs text-text_secondary">{property_name || "N/A"}</p>
      </div>

      <div className="w-[150px] text-xs text-text_secondary font-semibold">
        {description ?? "-"}
      </div>

      <div className="w-[200px] text-sm text-text_secondary font-semibold">
        {item?.detailed_info?.service_provider_brand || "N/A"}
      </div>

      <div className="w-[150px] space-y-0">
        {item?.detailed_info?.service_provider_brand === "Schindler" ? (
          <>
            <p className="text-sm text-text_secondary font-semibold">
              {responseTime ?? "-"}
            </p>
            <p className="text-xs text-text_secondary">
              {arrivalDate
                ? dayjs(arrivalDate).format("DD MMM YYYY, HH:mm")
                : ""}
            </p>
          </>
        ) : (
          <p className="text-xs text-text_secondary italic">-</p>
        )}
      </div>

      <div className="w-[146px] flex flex-col items-start justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              effectiveStatus.toLowerCase() === "open"
                ? "bg-[#FF3B30]"
                : "bg-[#1F98B2]"
            }`}
          />
          <p className="text-sm text-text_secondary font-semibold">
            {effectiveStatus}
          </p>
        </div>
        <p className="text-xs text-text_secondary mt-1">
          {item?.detailed_info?.updated_date
            ? dayjs(item.detailed_info.updated_date).format("DD MMM YYYY")
            : ""}
        </p>
      </div>

      <ChevronRight
        size={20}
        color="#898EA6"
        className="opacity-70 group-hover:opacity-100"
      />
    </Link>
  );
}
