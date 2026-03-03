import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
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

export default function AverageResponseTimeChart({ data = [] }) {
  const formattedData = data.map((item) => ({
    name: item.month.charAt(0), // ⬅️ Show only first letter of month
    fullMonth: item.month,
    avgMinutes: item.avg_response_minutes, // ⬅️ Updated key
    limit: item.callbacks_with_response_time,
  }));

  return (
    <div className="w-[380px] rounded-xl bg-bg_primary p-6">
      <div className="flex items-center gap-3">
        <div>
          <p className="text-2xl text-black font-semibold">
            Average Response Time
          </p>
          <p className="bg-[#EAECEF] rounded-full text-xs text-gray-500 font-medium px-3 py-1 w-fit text-center mt-1">
            Minutes Monthly
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={310} className="mt-6 -ml-5">
        <BarChart data={formattedData} barCategoryGap={40}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0, 1500]}
            // ticks={[20, 40, 60, 80, 700]}
            allowDecimals={false}
            tickFormatter={(v) =>
              typeof v === "number" && !Number.isInteger(v) ? Math.round(v) : v
            }
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
            shared={false}
          />
          {/* Bars */}
          <Bar dataKey="avgMinutes" radius={[4, 4, 4, 4]} barSize={15}>
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry ? "url(#goodPattern)" : "url(#callbackPattern)"}
              />
            ))}
          </Bar>
          {/* Limit reference bar */}
          {formattedData.map((entry, index) => {
            return (
              <ReferenceDot
                key={`limit-${index}`}
                x={index}
                y={entry.limit}
                isFront
                shape={(props) => {
                  const { cx, cy } = props;
                  return (
                    <rect
                      x={cx - 13}
                      y={cy - -2}
                      width={20}
                      height={6}
                      rx={4}
                      fill="#000"
                      stroke="#fff"
                      strokeWidth={1.5}
                    />
                  );
                }}
              />
            );
          })}{" "}
          {/* Patterns */}
          <defs>
            <pattern
              id="limitPattern"
              patternUnits="userSpaceOnUse"
              width="8"
              height="8"
              patternTransform="rotate(45)"
            >
              <rect width="8" height="8" fill="#C2285A" />
              <rect width="4" height="8" fill="rgba(255,255,255,0.3)" />
            </pattern>
            <pattern
              id="callbackPattern"
              patternUnits="userSpaceOnUse"
              width="8"
              height="8"
              patternTransform="rotate(45)"
            >
              <rect width="8" height="8" fill="#DC6B43" />
              <rect width="4" height="8" fill="rgba(255,255,255,0.25)" />
            </pattern>
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

            {/* <pattern
              id="criticalPattern"
              patternUnits="userSpaceOnUse"
              width="8"
              height="8"
              patternTransform="rotate(45)"
            >
              <rect width="8" height="8" fill="#C2285A" />
              <rect width="4" height="8" fill="rgba(255,255,255,0.25)" />
            </pattern> */}
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
          <span className="w-3 h-3 border-2 border-[#32B8EB] rounded-full"></span>
          Avg Minutes
        </span>
      </div>
    </div>
  );
}
