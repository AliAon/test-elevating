"use client";

import { mL } from "@/helpers/constant";
import { Loader, X } from "lucide-react";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white text-xs px-2 py-1 rounded-full">
        {payload[0].value}
      </div>
    );
  }
  return null;
};

export default function CallbacksSelectedMonth({
  data = [],
  isLoading,
  setSelectedMonth,
  setLevel3,
  selectedMonth,
}) {
  const formatted = data.map((item) => ({
    name: item.building_name,
    value: item.callback_count ?? 0,
    status: "callbacks",
    target: item.rate_of_breakdown ?? 100,
    building_id: item.building_id,
  }));
  const selectedMonthMonth = selectedMonth?.split("-")[1]?.replace("0", "");
  const month = Number(selectedMonthMonth) - 1;

  return (
    <div className="relative flex-1 rounded-xl bg-bg_primary p-6 ">
      <button
        className="absolute top-5 right-5 cursor-pointer"
        onClick={() => setSelectedMonth("")}
      >
        <X />
      </button>
      <div className="items-center gap-2 mt-1">
        <p className="text-2xl text-black font-semibold">Callbacks</p>
        <p className="bg-[#EAECEF] rounded-full text-xs text-gray-500 font-medium px-3 py-1 w-fit text-center mt-1">
          Buildings that are best maintained in {mL[month]}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={320} className="mt-5">
            <BarChart
              data={formatted}
              layout="vertical"
              margin={{ top: 10, right: 40, left: 40, bottom: 10 }}
              barCategoryGap={20}
            >
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                tickFormatter={(v) =>
                  typeof v === "number" && !Number.isInteger(v)
                    ? Math.round(v)
                    : v
                }
              />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
                shared={false}
              />

              <Bar
                dataKey="value"
                barSize={13}
                radius={[10, 10, 10, 10]}
                onClick={(data) => {
                  setSelectedMonth("");
                  setLevel3({
                    level3_name: data?.payload?.name,
                    level3_id: data?.payload?.building_id,
                  });
                }}
                className="cursor-pointer"
              >
                {formatted.map((entry, index) => (
                  <Cell key={index} fill="url(#callbacksPattern)" />
                ))}
              </Bar>

              {formatted.map((d, i) => (
                <ReferenceLine
                  key={i}
                  x={d.target}
                  stroke="black"
                  strokeWidth={2}
                />
              ))}

              <defs>
                <pattern
                  id="callbacksPattern"
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                  patternTransform="rotate(45)"
                >
                  <rect width="8" height="8" fill="#248EA5" />
                  <rect width="4" height="8" fill="rgba(255,255,255,0.25)" />
                </pattern>
              </defs>
            </BarChart>
          </ResponsiveContainer>

          <div className="flex justify-center gap-6 mt-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-[#248EA5] rounded-full"></span>
              Callbacks
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-black rounded-full"></span>
              Target
            </span>
          </div>
        </>
      )}
    </div>
  );
}
