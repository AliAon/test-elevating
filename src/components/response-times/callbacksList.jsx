import React from "react";
import { Input } from "../ui/input";
import { ChevronRight, ChevronsUpDown, SlidersHorizontal } from "lucide-react";

export default function CallbacksList() {
  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-2xl text-black font-semibold">Callbacks History</p>
          <p className="bg-[#EAECEF] w-fit rounded-full text-xs text-gray-500 font-medium px-2 py-1  text-center mt-1">
            EAST TOWER
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-[297px] h-11 bg-gradient-to-r from-[#FFCBB6] to-primary/0 rounded-2xl p-[1px]">
            <img
              src="/assets/svg/search.svg"
              alt=""
              width={24}
              height={24}
              className="absolute top-1/2 -translate-y-1/2 left-5"
            />
            <Input
              placeholder={`Try searching "property"`}
              className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
            />
          </div>
          <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
            <SlidersHorizontal size={20} className="text-text_secondary" />
            <p className="text-sm text-text_secondary font-semibold">Filter</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full mt-5">
        <TableHeader />
        <div className="mt-2 min-w-[700px] space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <TableRow key={row} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TableHeader() {
  return (
    <div className="min-w-[700px] h-8 flex items-center justify-between">
      <div className="w-[192px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Callback On
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[192px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Equipment ID
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[150px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Group
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[200px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Problem
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[150px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Reported On <ChevronsUpDown size={16} />
      </div>

      <div className="w-[146px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Status
        <ChevronsUpDown size={16} />
      </div>
    </div>
  );
}

function TableRow() {
  return (
    <div className="w-full flex items-center justify-between bg-white rounded-2xl">
      <div className="w-[192px] p-4 space-y-1">
        <p className="text-sm text-text_primary font-semibold">01 Mar 2025</p>
        <span className="text-xs">13:25:54</span>
      </div>

      <div className="w-[192px] p-4 space-y-1">
        <p className={`text-sm font-semibold text-text_secondary`}>
          EN 81-20 / EN 81-50{" "}
        </p>
      </div>

      <div className="w-[150px] p-4 space-y-1">
        <p className="text-sm text-text_secondary font-semibold">
          Service Lift
        </p>
      </div>

      <div className="w-[200px] flex items-start gap-2 p-4">
        <p className="text-sm text-text_secondary font-semibold">
          Lift Stopped{" "}
        </p>
      </div>

      <div className="w-[150px] p-4 space-y-1">
        <p className="text-sm text-text_primary font-semibold">19 Mar 2025</p>
        <span className="text-xs">13:25:54</span>
      </div>

      <div className="w-[146px] p-4 space-y-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#1F98B2]" />
          <p className="text-sm text-text_secondary font-semibold">Closed</p>
        </div>

        <ChevronRight size={20} color="#898EA6" className="cursor-pointer" />
      </div>
    </div>
  );
}
