import { ChevronsUpDown } from "lucide-react";
import React from "react";

export default function BuildingTableHeader() {
  return (
    <div className="min-w-[600px] h-8 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-2">
      <div className="w-[165px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4 uppercase tracking-wide">
        Name
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[152px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4 uppercase tracking-wide">
        Floors
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[235px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4 uppercase tracking-wide">
        Owner Name
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[152px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4 uppercase tracking-wide">
        Person Name
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[170px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4 uppercase tracking-wide">
        Country
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[120px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4 uppercase tracking-wide">
        State
        <ChevronsUpDown size={16} />
      </div>
    </div>
  );
}
