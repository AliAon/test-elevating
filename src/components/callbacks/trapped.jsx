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
    <foreignObject x={x + width + 6} y={y - 4} width={60} height={20}>
      <div className="text-[10px] px-2 py-[1px] rounded-full bg-black text-white font-semibold w-fit">
        {value + " Event"}
      </div>
    </foreignObject>
  );
};

export default function Trapped({ data: dataTrapped }) {
  const formatedData = dataTrapped?.map((item) => ({
    name: item?.building_name,
    value: item?.trapped_count,
  }));

  return (
    <div className="w-[380px] bg-bg_primary rounded-xl  shadow-sm ">
      <div>
        <p className="text-[18px] font-semibold text-black p-6 pb-0">
          {" "}
          Trapped Passengers
        </p>
        <p className="bg-[#EAECEF] rounded-full ml-6 text-xs text-gray-500 font-medium px-3 py-1 w-fit text-center mt-1">
          Buildings that are best maintained
        </p>
      </div>

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
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tickFormatter={(v) =>
                typeof v === "number" && !Number.isInteger(v)
                  ? Math.round(v)
                  : v
              }
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
            />

            {/* <Tooltip cursor={{ fill: "transparent" }} shared={false} /> */}

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
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-[#1F98B2] rounded-[4px]"></span> Trapped
          Passengers
        </span>
      </div>
    </div>
  );
}
