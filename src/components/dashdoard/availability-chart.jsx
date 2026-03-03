import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const responseData = [
  { month: "J", value: 50 },
  { month: "F", value: 110 },
  { month: "M", value: 80 },
  { month: "A", value: 90 },
  { month: "M", value: 60 },
  { month: "J", value: 70 },
  { month: "J", value: 110 },
  { month: "A", value: 95 },
  { month: "S", value: 65 },
  { month: "O", value: 100 },
  { month: "N", value: 75 },
  { month: "D", value: 80 },
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

const AvailabilityChart = () => {
  const [hoverStatus, setHoverStatus] = useState(null);

  return (
    <>
      <ResponsiveContainer width="100%" height={280} className="mt-10 -ml-5">
        <BarChart data={responseData} barCategoryGap={5}>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            fontSize={12}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0, 120]}
            ticks={[20, 40, 60, 80, 100, 120]}
            fontSize={12}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
            shared={false}
          />

          {/* Response bars */}
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            fill="url(#responsePattern)"
            opacity={hoverStatus === "callback" ? 1 : hoverStatus ? 0.3 : 1} // dim when not hovered
          />

          {/* Limit line */}
          <ReferenceLine
            y={100}
            stroke="black"
            strokeWidth={hoverStatus === "limit" ? 4 : 2}
            strokeOpacity={hoverStatus === "limit" ? 1 : hoverStatus ? 0.3 : 1}
          />

          <defs>
            <pattern
              id="responsePattern"
              patternUnits="userSpaceOnUse"
              width="8"
              height="8"
              patternTransform="rotate(45)"
            >
              <rect width="8" height="8" fill="#1F98B2" />
              <rect width="4" height="8" fill="rgba(255,255,255,0.4)" />
            </pattern>
          </defs>
        </BarChart>
      </ResponsiveContainer>

      {/* Custom Legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <span
          onMouseEnter={() => setHoverStatus("target")}
          onMouseLeave={() => setHoverStatus(null)}
          className="flex items-center gap-1 cursor-pointer"
        >
          <span className="w-3 h-3 border-2 border-black rounded-full"></span>
          Target
        </span>
        <span
          onMouseEnter={() => setHoverStatus("response")}
          onMouseLeave={() => setHoverStatus(null)}
          className="flex items-center gap-1 cursor-pointer"
        >
          <span className="w-3 h-3 border-2 border-[#1F98B2] rounded-full"></span>
          Response
        </span>
      </div>
    </>
  );
};

export default AvailabilityChart;
