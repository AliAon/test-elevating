import { Loader } from "lucide-react";
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

const CustomTooltip = ({ active, payload, value, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const count = data?.count ?? 0;
    const val = value ?? payload[0].value;
    const monthLabel = label ?? data?.month ?? "";
    
    // If count is 0, show "No Activity"
    if (count === 0) {
      return (
        <div className="bg-black text-white text-xs px-2 py-1 rounded-full">
          No Activity{monthLabel ? ` in ${monthLabel}` : ""}
        </div>
      );
    }
    
    // If count > 0, show achieved percentage
    const num = Number(val);
    const display = Number.isFinite(num)
      ? Number.isInteger(num)
        ? String(num)
        : num.toFixed(1)
      : val;
    
    return (
      <div className="bg-black text-white text-xs px-2 py-1 rounded-full">
        Achieved {display}%{monthLabel ? ` in ${monthLabel}` : ""}
      </div>
    );
  }
  return null;
};

const CustomBar = (props) => {
  const { fill, x, y, width, height, value } = props;
  
  // If value is 0, show a small circle indicator at the base
  if (value === 0) {
    return (
      <circle
        cx={x + width / 2}
        cy={y}
        r={4}
        fill="#DC6B43"
        stroke="#fff"
        strokeWidth={1}
      />
    );
  }
  
  // Otherwise render the normal bar
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      rx={4}
      ry={4}
    />
  );
};

const ResponseTimeChart = ({ data = [], isLoading, isFetching }) => {
  const [hoverStatus, setHoverStatus] = useState(null);

  const chartData = data?.map((item, index) => ({
    month: Array.isArray(item.month) ? item.month[0] : item.month,
    value: item.avgCompliance,
    count: item.count ?? 0,
    id: `${index}-${item.month}`, // Add unique identifier
  }));

  return (
    <>
      {isLoading || isFetching ? (
        <div className="h-full flex items-center justify-center min-h-60">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <>
          <ResponsiveContainer
            width="100%"
            height={280}
            className="mt-10 -ml-5"
          >
            <BarChart data={chartData} barCategoryGap={5}>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false}
                allowDuplicatedCategory={false}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
              />
              <Tooltip
                content={(props) => (
                  <CustomTooltip {...props} value={props.payload?.[0]?.value} />
                )}
                cursor={{ fill: "transparent" }}
                shared={false}
              />

              <Bar
                dataKey="value"
                shape={<CustomBar />}
                fill="url(#responsePattern)"
                opacity={hoverStatus === "response" ? 1 : hoverStatus ? 0.3 : 1}
              />

              <ReferenceLine
                y={100}
                stroke="black"
                strokeWidth={hoverStatus === "limit" ? 4 : 2}
                strokeOpacity={
                  hoverStatus === "limit" ? 1 : hoverStatus ? 0.3 : 1
                }
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

          <div className="flex justify-center gap-6 mt-4 text-sm">
            <span
              onMouseEnter={() => setHoverStatus("limit")}
              onMouseLeave={() => setHoverStatus(null)}
              className="flex items-center gap-1 cursor-pointer"
            >
              <span className="w-3 h-3 border-2 border-black rounded-full"></span>
              Limit
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
      )}
    </>
  );
};

export default ResponseTimeChart;
