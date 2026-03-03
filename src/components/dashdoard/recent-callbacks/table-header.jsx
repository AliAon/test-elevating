import { ChevronsUpDown } from "lucide-react";
import React from "react";

export default function RecentHeader({ onSetSortkey, onSetSortOrder }) {
  return (
    <div className="min-w-[1100px] h-12 flex items-center justify-between bg-gray-50 rounded-lg px-4 border border-gray-200">
      <div className="w-[192px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Type & Date
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("job_date");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[192px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Equipment
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("property_name");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[150px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Issue/Purpose
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("description");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[200px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Provider
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("service_provider_brand");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[150px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Response Time
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("arrivalDate");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[146px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Status
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("jobStatus");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[20px] flex items-center gap-2 text-xs text-text_secondary font-semibold"></div>
    </div>
  );
}
