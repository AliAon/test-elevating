import { ChevronsUpDown } from "lucide-react";
import React from "react";

export default function TableHeader({ onSetSortkey, onSetSortOrder }) {
  return (
    <div className="min-w-[700px] h-8 flex items-center justify-between bg-gray-50 border border-gray-200 shadow-sm rounded-xl">
      <div className="w-[247px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Name
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("fullname");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[298px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Contact
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("phone_number");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[160px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Company
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("company");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[164px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Position
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("user_type");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[162px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Status
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("is_active");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
    </div>
  );
}
