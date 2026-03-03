import React from "react";
import { Link } from "react-router-dom";

export default function TableRow({ row, equipmentsList }) {
  const equipment = equipmentsList?.find((item) => item.equipment_id == row);
  if (!equipment) {
    return;
  }

  return (
    <Link
      to={`/equipment-details/${equipment?.equipment_id}`}
      className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer"
    >
      <div className="w-[165px] flex items-center gap-2 text-sm text-text_primary font-semibold p-4">
        {equipment?.equipment_name}
      </div>
      <div className="w-[152px] flex items-center gap-2 text-sm text-text_secondary font-semibold p-4">
        {equipment?.equipment_type}
      </div>
      <div className="w-[235px] flex items-center gap-2 text-sm text-text_secondary font-semibold p-4">
        {equipment?.equipment_type}
      </div>
      <div className="w-[152px] flex items-center gap-2 text-sm text-text_primary font-semibold p-4">
        {equipment?.model_number}
      </div>
      <div className="w-[170px] flex items-center gap-2 text-sm text-text_primary font-semibold p-4">
        {equipment?.design_code}
      </div>
      <div className="w-[120px] flex items-center gap-2 text-sm text-text_secondary font-semibold p-4">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            equipment?.equipment_status?.toLowerCase() === "active"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {equipment?.equipment_status}
        </span>
      </div>
    </Link>
  );
}
