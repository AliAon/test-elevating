import { ChevronsUpDown } from "lucide-react";
import React from "react";

export default function TableHeader() {
  return (
    <div className="min-w-[700px] h-8 flex items-center justify-between">
      <div className="w-[162px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Contract
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[143px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Contract Type
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[190px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Start and Currect Price
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[200px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Start and End
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[164px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Next Fee Adj. Date
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[155px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Adjustment Rate
        <ChevronsUpDown size={16} />
      </div>
    </div>
  );
}
