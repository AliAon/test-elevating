import { ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function TableRow({ row }) {
  return (
    <div className="w-full flex items-start justify-between bg-white rounded-2xl">
      <div className="w-[255px] p-4 space-y-1">
        <p className="text-sm text-text_primary font-semibold truncate">
          {row?.contract?.label}
        </p>
        <p className="text-xs text-text_secondary font-medium">
          {row?.contract?.code}
        </p>
      </div>

      <div className="w-[150px] flex items-start gap-2 p-4">
        <img src="/assets/svg/connector.svg" alt="" width={14} height={40} />
        <div className="space-y-1">
          <p className="text-sm text-text_primary font-semibold">
            {row?.start_end?.start}
          </p>
          <p className="text-xs text-text_secondary font-medium">
            {row?.start_end?.end}
          </p>
          <p className="text-xs text-[#248EA5] font-medium">
            {row?.start_end?.day_left}
          </p>
        </div>
      </div>

      <div className="w-[104px] p-4 space-y-1">
        <div
          className={`w-fit rounded-full px-3 py-1 ${
            row?.contract_type === "Type 1"
              ? "bg-[#B468B926]"
              : row?.contract_type === "Type 2"
                ? "bg-[#1F98B226]"
                : row?.contract_type === "Type 3"
                  ? "bg-[#248EA526]"
                  : "bg-gray-200"
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              row?.contract_type === "Type 1"
                ? "text-[#B468B9]"
                : row?.contract_type === "Type 2"
                  ? "text-[#1F98B2]"
                  : row?.contract_type === "Type 3"
                    ? "text-[#248EA5]"
                    : "text-gray-700"
            }`}
          >
            {row?.contract_type}
          </p>
        </div>
      </div>

      <div className="w-[204px] p-4 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#C2285A26] text-xs font-semibold text-[#B468B9]">
            DT
          </div>
          <p className="text-sm text-text_primary font-semibold">
            Daniel Thompson
          </p>
        </div>
      </div>

      <div className="w-[300px] p-4 space-y-1 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <img src="/assets/svg/call.svg" alt="" width={16} height={16} />
            <p className="text-sm text-text_primary font-semibold">
              +61 29123 4567
            </p>
          </div>

          <div className="flex items-center gap-2">
            <img src="/assets/svg/mail.svg" alt="" width={16} height={16} />
            <p className="text-sm text-text_primary font-semibold">
              daniel.thompson@auslift.com
            </p>
          </div>
        </div>
        <Link to={`/admin/es-contracts-details/${row?.id}`}>
          <ChevronRight size={20} color="#898EA6" className="cursor-pointer" />
        </Link>
      </div>
    </div>
  );
}
