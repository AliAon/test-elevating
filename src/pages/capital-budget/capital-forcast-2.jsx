import { Loader } from "lucide-react";
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

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const high = payload.find((p) => p.dataKey === "high")?.value;
    const low = payload.find((p) => p.dataKey === "low")?.value;
    const avg = payload.find((p) => p.dataKey === "avg")?.value;

    return (
      <div className="bg-black text-white text-xs px-3 py-2 rounded-xl space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#248EA5]"></span>
          <span>High: ${high}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1F98B2]"></span>
          <span>Low: ${low}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C2285A]"></span>
          <span>Equipment Count: {avg}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function CapitalBudgetForecast2({
  data = [],
  date,
  isMonthWiseLoading,
  isMonthWiseFetching,
}) {
  const chartData = data.map((item) => ({
    month: monthNames[item.month - 1] || item.month,
    high: item.total_max_cost,
    low: item.total_min_cost,
    avg: item.equipment_count,
  }));

  return (
    <div className="flex-1 bg-bg_primary rounded-xl p-6">
      <p className="text-2xl font-semibold text-black">
        Capital Budget Forecast
      </p>
      <p className="text-xs text-gray-500 font-medium mt-2">For {date}</p>

      {isMonthWiseLoading || isMonthWiseFetching ? (
        <div className="flex items-center justify-center h-full">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <>
          <ResponsiveContainer
            width="100%"
            height={280}
            className="mt-10 -ml-5"
          >
            <BarChart data={chartData} barCategoryGap={20}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#666" }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
                shared={false}
              />

              <Bar dataKey="high" radius={[8, 8, 8, 8]}>
                {chartData.map((_, index) => (
                  <Cell key={`high-${index}`} fill="url(#highPattern)" />
                ))}
              </Bar>

              <Bar dataKey="low" radius={[8, 8, 8, 8]}>
                {chartData.map((_, index) => (
                  <Cell key={`low-${index}`} fill="url(#lowPattern)" />
                ))}
              </Bar>

              <Bar dataKey="avg" radius={[8, 8, 8, 8]}>
                {chartData.map((_, index) => (
                  <Cell key={`avg-${index}`} fill="url(#avgPattern)" />
                ))}
              </Bar>

              <defs>
                <pattern
                  id="highPattern"
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                  patternTransform="rotate(45)"
                >
                  <rect width="8" height="8" fill="#248EA5" />
                  <rect width="4" height="8" fill="rgba(255,255,255,0.25)" />
                </pattern>

                <pattern
                  id="lowPattern"
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                  patternTransform="rotate(45)"
                >
                  <rect width="8" height="8" fill="#1F98B2" />
                  <rect width="4" height="8" fill="rgba(255,255,255,0.25)" />
                </pattern>
                <pattern
                  id="avgPattern"
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

          <div className="flex justify-center gap-6 mt-4 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-[#248EA5] rounded-full"></span>
              Total min cost
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-[#1F98B2] rounded-full"></span>
              Total max cost
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-[#1F98B2] rounded-full"></span>
              Equipment Count
            </span>
          </div>
        </>
      )}
    </div>
  );
}
