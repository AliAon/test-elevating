"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Button } from "../ui/button";
import { Loader, X } from "lucide-react";

const tabs = [
  { key: "amount", title: "Amount" },
  { key: "callbacks", title: "Callbacks" },
  { key: "downtime", title: "Downtime" },
];

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

export default function KPIPanaltySelectedMonth({
  setSelectedMonth,
  kpiData,
  isLoading,
  setSelectedState,
  setSelectedBuilding,
  selectedMonth,
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const buildings = kpiData?.buildings || [];

  // Map chart data according to active tab
  const chartData = buildings.map((b) => ({
    id: b.building_id,
    name: b.building_name || "N/A",
    value:
      activeIndex === 0
        ? b.total_penalty
        : activeIndex === 1
          ? b.callbacks
          : b.downtime,
  }));

  return (
    <div className="flex-1 bg-bg_primary rounded-xl p-6">
      {/* Header */}
      <div className="flex justify-between relative">
        <div>
          <p className="text-xs text-gray-500 font-medium mt-2">
            For {selectedMonth}
          </p>

          <div className="flex items-center gap-2">
            <p className="text-2xl text-black font-semibold">KPI Penalty</p>
            <p className="bg-[#EAECEF] py-1 px-2 rounded-full text-xs">PPM</p>
          </div>
        </div>

        <div className="w-fit flex items-center">
          {/* Tabs */}
          <div className="max-w-fit h-13 grid grid-cols-3 rounded-2xl bg-white p-1 mt-5">
            {tabs.map((tab, index) => (
              <button
                key={tab.key}
                onClick={() => setActiveIndex(index)}
                className={`h-full w-full text-sm font-medium cursor-pointer px-4 rounded-2xl transition-colors ${
                  activeIndex === index
                    ? "bg-bg_primary text-text_primary"
                    : "text-text_secondary"
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          <Button
            onClick={() => setSelectedMonth(null)}
            variant={"gost"}
            className={"absolute -top-5 -right-5"}
          >
            <X />
          </Button>
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320} className="mt-5 -ml-14">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 40, left: 40, bottom: 10 }}
            barCategoryGap={20}
          >
            <XAxis type="number" axisLine={false} tickLine={false} />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              width={120}
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
                setSelectedState(data.id);
              }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  onClick={() => {
                    setSelectedState(entry.id);
                    setSelectedMonth(null);
                  }}
                  key={index}
                  fill="#248EA5"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-3 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-bg_primary rounded-full"></span>
          {tabs[activeIndex].title}
        </span>
      </div>
    </div>
  );
}
