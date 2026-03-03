import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  ReferenceDot,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", Callbacks: 3, Technical: 2, External: 1, Limit: 4, Line: 4 },
  { month: "Feb", Callbacks: 6, Technical: 3, External: 2, Limit: 5, Line: 5 },
  { month: "Mar", Callbacks: 5, Technical: 4, External: 2, Limit: 5, Line: 6 },
  { month: "Apr", Callbacks: 4, Technical: 3, External: 1, Limit: 4, Line: 5 },
  { month: "May", Callbacks: 6, Technical: 4, External: 2, Limit: 6, Line: 4 },
  { month: "Jun", Callbacks: 3, Technical: 2, External: 1, Limit: 3, Line: 5 },
  { month: "Jul", Callbacks: 4, Technical: 2, External: 1, Limit: 4, Line: 6 },
  { month: "Aug", Callbacks: 7, Technical: 3, External: 2, Limit: 7, Line: 7 },
  { month: "Sep", Callbacks: 5, Technical: 3, External: 1, Limit: 5, Line: 6 },
  { month: "Oct", Callbacks: 6, Technical: 3, External: 1, Limit: 6, Line: 5 },
  { month: "Nov", Callbacks: 5, Technical: 2, External: 1, Limit: 5, Line: 4 },
  { month: "Dec", Callbacks: 4, Technical: 3, External: 1, Limit: 4, Line: 4 },
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

export default function CallbackBreakdownsChart() {
  return (
    <div className="flex-1 bg-bg_primary rounded-xl p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">
        Callbacks & Breakdowns
      </h2>
      <p className="w-fit text-text_secondary text-xs mb-4 bg-[#EAECEF] rounded-full px-2 py-1">
        in last 12 months
      </p>

      <ResponsiveContainer width="100%" height={300} className="-ml-10">
        <BarChart data={data} barCategoryGap={25} barGap={4} barSize={12}>
          <CartesianGrid stroke="#E3E3E3" vertical={false} />

          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#555", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#999", fontSize: 12 }}
            domain={[0, 10]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
            shared={false}
          />

          <Bar
            dataKey="Callbacks"
            fill="url(#callbacksPattern)"
            radius={[8, 8, 8, 8]}
            stroke="#248EA5"
            strokeWidth={0.6}
          />
          <Bar
            dataKey="Technical"
            fill="url(#technicalPattern)"
            radius={[8, 8, 8, 8]}
            stroke="#1F98B2"
            strokeWidth={0.6}
          />
          <Bar
            dataKey="External"
            fill="url(#externalPattern)"
            radius={[8, 8, 8, 8]}
            stroke="#C2285A"
            strokeWidth={0.6}
          />

          <Line
            type="monotone"
            dataKey="Line"
            stroke="#C2285A"
            strokeWidth={3}
            dot={false}
          />

          {data.map((d, i) => (
            <ReferenceDot
              key={i}
              x={d.month}
              y={d.Limit}
              isFront
              shape={(props) => {
                const { cx, cy } = props;
                return (
                  <rect
                    x={cx - 31}
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

          <defs>
            <pattern
              id="callbacksPattern"
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45)"
            >
              <rect width="6" height="6" fill="#248EA5" />
              <rect width="3" height="6" fill="rgba(255,255,255,0.3)" />
            </pattern>

            <pattern
              id="technicalPattern"
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45)"
            >
              <rect width="6" height="6" fill="#1F98B2" />
              <rect width="3" height="6" fill="rgba(255,255,255,0.3)" />
            </pattern>

            <pattern
              id="externalPattern"
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45)"
            >
              <rect width="6" height="6" fill="#C2285A" />
              <rect width="3" height="6" fill="rgba(255,255,255,0.3)" />
            </pattern>
          </defs>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 mt-3 text-sm text-gray-700">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-[#A3C420] rounded-sm"></span>
          Callbacks
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-[#51B1E5] rounded-sm"></span>
          Technical
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-[#E25184] rounded-sm"></span>
          External
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 border-2 border-black rounded-full"></span>
          Limits
        </div>
      </div>
    </div>
  );
}
