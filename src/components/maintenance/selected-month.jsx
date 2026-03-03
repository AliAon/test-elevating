import { mL } from "@/helpers/constant";
import dayjs from "dayjs";
import { Loader, X } from "lucide-react";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const transformData = (backend) => {
  return backend.map((item) => {
    const value = item.performance_pct;

    let status = "good";
    if (value < 80 && value >= 50) status = "normal";
    if (value < 50) status = "critical";

    return {
      name: item.building_name,
      value: value,
      status: status,
    };
  });
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white text-xs px-2 py-1 rounded-full">
        {payload[0].value}%
      </div>
    );
  }
  return null;
};

export default function MaintenanceSelectedMoth({
  data: backendData,
  selectedMonth,
  isMonthlyLoading,
  isMonthlyFetching,
  setSelectedMonth,
}) {
  const data = transformData(backendData || []);
  const month = selectedMonth.split("-")[1].replace("0", "");

  return (
    <div className="relative w-full rounded-xl bg-bg_primary p-6 mt-5">
      <button
        className="absolute top-5 right-5 cursor-pointer"
        onClick={() => setSelectedMonth("")}
      >
        <X />
      </button>
      <p className="text-xs text-text_secondary font-medium">{selectedMonth}</p>

      <div className="flex items-center gap-2 mt-1">
        <p className="text-2xl text-black font-semibold">Maintenance</p>
        <p className="bg-[#EAECEF] rounded-full text-xs text-text_secondary font-medium px-2 py-1">
          Buildings that are best maintained in{" "}
          {dayjs(selectedMonth).format("MMMM")}
        </p>
      </div>

      {isMonthlyLoading || isMonthlyFetching ? (
        <div className="flex items-center justify-center h-60">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <>
          <ResponsiveContainer
            width="100%"
            height={320}
            className="mt-5 -ml-11"
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 40, left: 40, bottom: 10 }}
              barCategoryGap={12}
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
                width={120}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
                shared={false}
              />

              <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={13}>
                {data.map((entry, index) => {
                  let fill = "url(#goodPattern)";
                  if (entry.status === "normal") fill = "url(#normalPattern)";
                  if (entry.status === "critical")
                    fill = "url(#criticalPattern)";
                  return <Cell key={`cell-${index}`} fill={fill} />;
                })}
              </Bar>

              <defs>
                <pattern
                  id="goodPattern"
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                  patternTransform="rotate(45)"
                >
                  <rect width="8" height="8" fill="#248EA5" />
                  <rect width="4" height="8" fill="rgba(255,255,255,0.25)" />
                </pattern>

                <pattern
                  id="normalPattern"
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                  patternTransform="rotate(45)"
                >
                  <rect width="8" height="8" fill="#1F98B2" />
                  <rect width="4" height="8" fill="rgba(255,255,255,0.25)" />
                </pattern>

                <pattern
                  id="criticalPattern"
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                  patternTransform="rotate(45)"
                >
                  <rect width="8" height="8" fill="#C2285A" />
                  <rect width="4" height="8" fill="rgba(255,255,255,0.25)" />
                </pattern>
              </defs>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-3 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-black rounded-full"></span>
              Limits
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-[#248EA5] rounded-full"></span>
              Good
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-[#1F98B2] rounded-full"></span>
              Normal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-[#C2285A] rounded-full"></span>
              Critical
            </span>
          </div>
        </>
      )}
    </div>
  );
}
