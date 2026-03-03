import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceDot,
} from "recharts";
import Share from "../../assets/svg/share.svg";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const hoveredBar = payload[0];
    const equipmentName = hoveredBar?.payload?.name;
    const callbackCount = hoveredBar?.value;

    return (
      <div className="bg-black text-white text-xs px-3 py-2 rounded-md">
        <p className="font-medium">{equipmentName}</p>
        <p>Callbacks: {callbackCount}</p>
      </div>
    );
  }
  return null;
};

export default function TotalCallbacksChart({ data = [] }) {
  // 🔥 Format API data into chart-ready format
  const formattedData = data?.map((item) => ({
    name: item?.equipment_name,
    callbacks: item?.count,
    limit: item.target, // no limit provided in API
    status: "normal", // default since API doesn't return status
  }));

  return (
    <div className="w-[380px] rounded-xl bg-bg_primary p-6">
      <div className="flex items-center gap-3">
        <img src={Share} alt="share" width={24} height={24} />

        <div>
          <p className="text-2xl text-black font-semibold">Focus Equipment</p>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Highest reported Callbacks equipment last 90 days.
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={310} className="mt-6 -ml-5">
        <BarChart data={formattedData} barCategoryGap={40}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            domain={[
              0,
              Math.max(...formattedData.map((d) => d.limit), 10) + 10,
            ]}
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
          <Bar dataKey="callbacks" radius={[4, 4, 4, 4]} barSize={15}>
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.callbacks > entry.limit
                    ? "url(#goodPattern)"
                    : "url(#callbackPattern)"
                }
              />
            ))}
          </Bar>

          {/* Limit reference bar */}
          {formattedData.map((entry, index) => (
            <ReferenceDot
              key={index}
              x={entry.name}
              y={entry.limit}
              isFront
              shape={(props) => {
                const { cx, cy } = props;
                return (
                  <rect
                    x={cx - 15}
                    y={cy - 2}
                    width={28}
                    height={7}
                    rx={5}
                    fill="#000"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                );
              }}
            />
          ))}

          {/* Patterns */}
          <defs>
            <pattern
              id="callbackPattern"
              patternUnits="userSpaceOnUse"
              width="8"
              height="8"
              patternTransform="rotate(45)"
            >
              <rect width="8" height="8" fill="#248EA5" />
              <rect width="4" height="8" fill="rgba(255,255,255,0.25)" />
            </pattern>
            <pattern
              id="goodPattern"
              patternUnits="userSpaceOnUse"
              width="8"
              height="8"
              patternTransform="rotate(45)"
            >
              <rect width="8" height="8" fill="#DC6B43" />
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
          <span className="w-3 h-3 border-2 border-[#32B8EB] rounded-full"></span>
          Callbacks
        </span>
      </div>
    </div>
  );
}
