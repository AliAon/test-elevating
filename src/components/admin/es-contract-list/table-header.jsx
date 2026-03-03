import { ChevronsUpDown } from "lucide-react";
import React from "react";

export default function TableHeader() {
  return (
    <div className="min-w-[700px] h-8 flex items-center justify-between">
      <div className="w-[255px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Contract
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[150px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Start and End
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[104px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Type
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[204px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Client Contact Person
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[300px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Client Contact Person
        <ChevronsUpDown size={16} />
      </div>
    </div>
  );
}
