import { ChevronRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function TableRow({ row }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/admin/es-client-details/${row?.user_id}`);
  };
  return (
    <div
      className="w-full flex items-center justify-between bg-white border border-gray-200 shadow-sm rounded-xl transition hover:shadow-md cursor-pointer"
      onClick={handleClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      <div className="w-[247px] p-4 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#C2285A26] text-xs font-semibold text-[#B468B9]">
            {row?.fullname?.charAt(0) || "-"}
          </div>
          <p className="text-sm text-text_primary font-semibold">
            {row?.fullname || "-"}
          </p>
        </div>
      </div>

      <div className="w-[298px] p-4">
        <div className="flex items-center gap-2">
          <img src="/assets/svg/call.svg" alt="" width={16} height={16} />
          <p className="text-sm text-text_primary font-semibold">
            {row?.phone_number || "-"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <img src="/assets/svg/mail.svg" alt="" width={16} height={16} />
          <p className="text-sm text-text_primary font-semibold">
            {row?.email}
          </p>
        </div>
      </div>

      <div className="w-[160px] p-4 space-y-1">
        <p className="text-sm font-semibold text-[#5B617F]">
          {row?.company || "-"}
        </p>
      </div>

      <div className="w-[164px] flex items-start gap-2 p-4">
        <p className="text-sm text-text_primary font-semibold capitalize">
          {row?.user_type || "-"}
        </p>
      </div>

      <div className="flex justify-between items-center w-[162px] p-4 space-y-1">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              row?.is_active ? "bg-[#8DA51D]" : "bg-[#C2285A]"
            } `}
          ></div>

          <p className="text-sm text-[#5B617F] font-semibold">
            {row?.is_active ? "Active" : "Inactive"}
          </p>
        </div>
        <ChevronRight size={20} color="#898EA6" className="cursor-pointer" />
      </div>
    </div>
  );
}
