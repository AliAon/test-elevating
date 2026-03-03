import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

const CustomLabel = (props) => {
  const { x, y, width, value } = props;
  return (
    <foreignObject x={x + width + 6} y={y - 4} width={40} height={20}>
      <div className="text-[10px] px-2 py-[1px] rounded-full bg-black text-white font-semibold w-fit">
        {value}%
      </div>
    </foreignObject>
  );
};

export default function SelectedMonthAverageResponseTime({
  data: dataTrapped,
}) {
  const formatedData = dataTrapped?.map((item) => ({
    name: item?.building_name,
    value: item?.avg_response_hours,
  }));

  return (
    <div className="w-[380px] bg-bg_primary rounded-xl  shadow-sm ">
      <p className="text-[18px] font-semibold text-black p-6 pb-0">
        {" "}
        Average Response Time
      </p>

      <div className="mt-6 -ml-5" style={{ width: "100%", height: 340 }}>
        <ResponsiveContainer>
          <BarChart
            data={formatedData}
            layout="vertical"
            barCategoryGap={12}
            margin={{ left: 30, right: 30 }}
          >
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#4A4A4A" }}
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              ticks={[0, 20, 40, 60, 80, 100]}
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
            />

            <Tooltip cursor={{ fill: "transparent" }} shared={false} />

            <Bar
              dataKey="value"
              radius={[8, 8, 8, 8]}
              barSize={14}
              fill="url(#stripePattern)"
            >
              <LabelList dataKey="value" content={<CustomLabel />} />
            </Bar>

            {/* Pattern Fill */}
            <defs>
              <pattern
                id="stripePattern"
                patternUnits="userSpaceOnUse"
                width="8"
                height="8"
                patternTransform="rotate(45)"
              >
                <rect width="8" height="8" fill="#1F98B2" />
                <rect width="4" height="8" fill="rgba(255,255,255,0.40)" />
              </pattern>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center mt-3 text-xs text-[#6B7280]">
        <div className="flex justify-center mt-3 text-xs text-[#6B7280] gap-4">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 border-2 border-[#1F98B2] rounded-full"></span>
            Response time
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 border-2 border-[#060606] rounded-full"></span>
            Target
          </span>
        </div>
      </div>
    </div>
  );
}
