import { ChevronsUpDown } from "lucide-react";
import React from "react";

export default function TableHeader() {
  return (
    <div className="h-8 flex items-center justify-between">
      <div className="w-[200px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Name
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[200px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Contact
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[160px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Company
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[164px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Position
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[160px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Assigned Clients
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[136px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        ES Subscriptions
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[162px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Status
        <ChevronsUpDown size={16} />
      </div>
    </div>
  );
}
