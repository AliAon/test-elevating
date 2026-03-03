import { ChevronsUpDown } from "lucide-react";
import React from "react";

export default function TableHeader({ onSetSortkey, onSetSortOrder }) {
  return (
    <div className="min-w-[600px] h-8 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-2">
      <div className="w-[165px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4 uppercase tracking-wide">
        Equipment
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("equipment_name");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[152px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4 uppercase tracking-wide">
        Type
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("equipment_type");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[235px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4 uppercase tracking-wide">
        Equipment Life
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("equipment_life");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[152px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4 uppercase tracking-wide">
        Model Number
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("model_number");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[170px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4 uppercase tracking-wide">
        Design Code
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("design_code");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[120px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4 uppercase tracking-wide">
        Status
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("equipment_status");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
    </div>
  );
}
