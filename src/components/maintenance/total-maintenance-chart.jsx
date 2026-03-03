import { useGetMaintainceBuilingStatsQuery } from "@/redux/services/maintenance";
import React from "react";
import { useSelector } from "react-redux";
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

export default function TotalMaintenanceChart() {
  const { subscription_id } = useSelector((state) => state.subscription_id);

  const { data: maintainceData } = useGetMaintainceBuilingStatsQuery(
    {
      es_subscription_id: subscription_id,
    },
    {
      skip: !subscription_id,
    },
  );
  const mappedData = maintainceData?.buildings?.map((item) => ({
    name: item.building_name,
    callbacks: item.total_maintenance,
    limit: item?.target_maintenance,
  }));

  return (
    <div className="w-[352px] rounded-xl bg-bg_primary p-6">
      <p className="text-2xl text-black font-semibold">Total Maintenance</p>

      <ResponsiveContainer width="100%" height={310} className="mt-6 -ml-5">
        <BarChart data={mappedData} barCategoryGap={40}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            domain={[0, 80]}
            tickFormatter={(v) =>
              typeof v === "number" && !Number.isInteger(v) ? Math.round(v) : v
            }
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
            shared={false}
          />

          <Bar dataKey="callbacks" radius={[4, 4, 4, 4]} barSize={15}>
            {mappedData?.map((entry, index) => (
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

          {mappedData?.map((entry, index) => {
            if (!entry?.target || entry.target <= 0) return null;
            return (
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
            );
          })}

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
              <rect width="8" height="8" fill="#248EA5" />
              <rect width="4" height="8" fill="rgba(255,255,255,0.25)" />
            </pattern>
          </defs>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 mt-3 text-sm">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 border-2 border-[#32B8EB] rounded-full"></span>
          Maintenance Done
        </span>
      </div>
    </div>
  );
}
