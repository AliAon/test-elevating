import React from "react";

export default function Loader({ size = "default" }) {
  const sizeClasses = size === "small" ? "w-5 h-5" : "w-10 h-10";
  
  return (
    <div className="flex items-center justify-center" role="status">
      <div className="relative">
        {/* Outer ring with pulse */}
        <div className={`${sizeClasses} rounded-full border-2 border-[#FFE3D6] absolute animate-pulse`}></div>
        
        {/* Inner ring with spin */}
        <div className={`${sizeClasses} rounded-full border-2 border-transparent border-t-[#F06B3C] border-r-[#F06B3C] animate-spin`}></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
