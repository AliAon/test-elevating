import React from "react";

export default function AdminServiceContractDeatilsCard({ item }) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-5">
      <div
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1F98B226]"
        style={{
          background: item?.icon_bg,
        }}
      >
        <img src={item?.icon} alt="" width={24} height={24} />
      </div>

      <div className="flex-1">
        <p className="text-xs text-text_secondary font-medium">{item?.title}</p>
        <p className="text-sm text-text_primary font-medium mt-1 flex flex-wrap gap-2">
          {item?.label}
        </p>
      </div>
    </div>
  );
}
