import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const getTypeColors = () => {
  const colorOptions = [
    { bg: "#B468B926", text: "#B468B9" },
    { bg: "#1F98B226", text: "#1F98B2" },
    { bg: "#248EA526", text: "#248EA5" },
    { bg: "#E5E5E526", text: "#666" },
  ];

  const randomIndex = Math.floor(Math.random() * colorOptions.length);
  return colorOptions[randomIndex];
};

export default function TableRow({ row }) {
  const bg = getTypeColors();

  return (
    <div
      className="
        grid 
       grid-cols-[1.2fr_0.7fr_1.2fr_2fr_1.2fr_0.3fr]
        w-full
        items-start 
        bg-white border border-gray-200 rounded-lg 
        hover:border-gray-300 hover:shadow-sm 
        transition-all duration-200 
        group px-2
      "
    >
      {/* Contract */}
      <div className="p-4 space-y-1">
        <p className="text-xs text-gray-500 font-medium">
          {row?.contract_number}
        </p>
        <p className="text-sm text-gray-900 font-semibold">
          {row?.contract_name}
        </p>
      </div>

      {/* Buildings */}
      <div className="p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold">
          {row?.building_ids?.length
            ? `${row.building_ids.length} Building${
                row.building_ids.length > 1 ? "s" : ""
              }`
            : "No buildings"}
        </p>
      </div>

      {/* Contract Type */}
      <div className="p-4 space-y-1">
        <p
          className="text-xs font-semibold px-3 py-1 rounded-full w-fit"
          style={{ color: bg.text, backgroundColor: bg.bg }}
        >
          {row?.plan_and_pricing?.contract_type}
        </p>
      </div>

      {/* Service Provider */}
      <div className="p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold">
          {row?.service_provider_details?.service_provider_name || "-"}
        </p>
        <p className="text-xs text-gray-500 font-medium">
          {row?.service_provider_details?.contact_person_name || "-"}
        </p>
        <p className="text-xs text-gray-500 font-medium">
          {row?.service_provider_details?.country_code}{" "}
          {row?.service_provider_details?.phone_no} •{" "}
          {row?.service_provider_details?.email || "-"}
        </p>
      </div>

      {/* Dates */}
      <div className="p-4 flex items-start gap-2">
        <img src="/assets/svg/connector.svg" alt="" width={14} height={40} />
        <div className="space-y-1">
          <p className="text-sm text-gray-900 font-semibold">
            {dayjs(row?.start_date).format("MMM DD, YYYY")}
          </p>
          <p className="text-xs text-gray-500 font-medium">
            {dayjs(row?.end_date).format("MMM DD, YYYY")}
          </p>
          <p className="text-xs text-green-600 font-semibold">
            {row?.days_remaining} Days left
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="flex items-center p-4">
        <Link to={`/contract-details/${row?.contract_id}`}>
          <ChevronRight
            size={18}
            className="text-gray-400 group-hover:text-primary transition-colors cursor-pointer"
          />
        </Link>
      </div>
    </div>
  );
}
