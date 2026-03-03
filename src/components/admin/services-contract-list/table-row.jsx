import { getTypeColors } from "@/helpers/contract";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function TableRow({ row, link = true }) {
  const typeColors = getTypeColors();
  return (
    <div className="w-full flex items-start justify-between bg-white rounded-2xl">
      <div className="w-[162px] p-4 space-y-1">
        <p className="text-sm text-text_primary font-semibold">
          {row?.contract_name}
        </p>
        <p className="text-xs text-text_secondary font-medium">
          ID. {row?.contract_number}
        </p>
        <p className="text-xs text-text_secondary font-medium">
          BY {row?.client_name}
        </p>
      </div>

      <div className="w-[143px] p-4 space-y-1">
        <div
          className={`w-fit rounded-full px-3 py-1`}
          style={{
            backgroundColor: typeColors?.bg,
            color: typeColors?.text,
          }}
        >
          <p className={`text-sm font-semibold `}>
            {row?.plan_and_pricing?.contract_type}
          </p>
        </div>
      </div>

      <div className="w-[200px] flex items-start gap-2 p-4">
        <img src="/assets/svg/connector.svg" alt="" width={14} height={40} />
        <div className="space-y-1">
          <p className="text-xs text-text_secondary font-semibold">
            ${row?.plan_and_pricing?.contract_price}/year
          </p>
          <p className="text-sm text-text_primary font-semibold">
            ${row?.plan_and_pricing?.contract_price}/year
          </p>
        </div>
      </div>

      <div className="w-[200px] flex items-start gap-2 p-4">
        <img src="/assets/svg/connector.svg" alt="" width={14} height={40} />
        <div className="space-y-1">
          <p className="text-sm text-text_primary font-semibold">
            {dayjs(row?.start_date).format("MMM D, YYYY")}
          </p>
          <p className="text-xs text-text_secondary font-medium">
            {dayjs(row?.end_date).format("MMM D, YYYY")}
          </p>
          <p
            className={cn(
              "text-xs 8CAA00] font-medium",
              row?.days_remaining < 0
                ? "text-[#C2285A]"
                : row?.days_remaining < 16
                  ? "text-[#F06B3C]"
                  : "text-[#248EA5]",
            )}
          >
            {row?.days_remaining}
          </p>
        </div>
      </div>

      <div className="w-[164px] p-4 space-y-1">
        <p className="text-sm text-text_primary font-semibold">
          {dayjs(row?.plan_and_pricing?.next_fee_adjustment_date).format(
            "DD MMM YYYY",
          )}
        </p>
      </div>

      <div className="w-[155px] p-4 space-y-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-text_secondary font-semibold">
            {row?.plan_and_pricing?.next_fee_adjustment_rate}%
          </p>
        </div>
        {link && (
          <Link to={`/admin/services-contracts-details/${row?.contract_id}`}>
            <ChevronRight
              size={20}
              color="#898EA6"
              className="cursor-pointer"
            />
          </Link>
        )}
      </div>
    </div>
  );
}
