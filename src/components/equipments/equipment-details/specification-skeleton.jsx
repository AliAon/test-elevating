"use client";

import React from "react";

export default function SpecificationSkeleton({ equipment_type }) {
  // Determine number of skeleton cards based on equipment type
  const skeletonCount = equipment_type === "ELEVATOR" ? 18 : 9;

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5 animate-pulse">
      <div className="h-8 w-60  rounded mb-6"></div>

      <div className="grid grid-cols-3 gap-2 mt-8">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl p-4">
            <div className="h-4 w-24  rounded mb-2"></div>
            <div className="h-4 w-16 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
