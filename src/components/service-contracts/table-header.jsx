import { ChevronsUpDown } from "lucide-react";
import React from "react";

export default function TableHeader({ onSetSortkey, onSetSortOrder }) {
  return (
    <div
      className="
        grid 
    grid-cols-[1.2fr_0.7fr_1.2fr_2fr_1.2fr_0.3fr]
        w-full
        h-10 items-center 
        bg-gray-50 border border-gray-200 
        rounded-lg px-2
      "
    >
      <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Contract{" "}
        <ChevronsUpDown
          size={14}
          className="text-gray-400 cursor-pointer"
          onClick={() => {
            onSetSortkey("contract_name");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Buildings{" "}
        <ChevronsUpDown size={14} className="text-gray-400 cursor-pointer" />
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Contract Type{" "}
        <ChevronsUpDown
          size={14}
          className="text-gray-400 cursor-pointer"
          onClick={() => {
            onSetSortkey("plan_and_pricing?.contract_type");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Service Provider{" "}
        <ChevronsUpDown
          size={14}
          className="text-gray-400 cursor-pointer"
          onClick={() => {
            onSetSortkey("service_provider_details?.service_provider_name");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Start/End{" "}
        <ChevronsUpDown
          size={14}
          className="text-gray-400 cursor-pointer"
          onClick={() => {
            onSetSortkey("start_date");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>

      <div></div>
    </div>
  );
}
