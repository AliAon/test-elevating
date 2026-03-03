import { useGetKpiPenaltySelectedBuildingGraphDataQuery } from "@/redux/services/dashboard-api";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------------- Custom Tooltip ---------------- */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white text-xs px-2 py-1 rounded-full">
        ${payload[0]?.value}
      </div>
    );
  }
  return null;
};

const KpiPenaltyChart = ({ level1, level2, level3 }) => {
  const [hoverStatus, setHoverStatus] = useState(null);

  const es_subscription_id = useSelector(
    (state) => state.subscription_id.subscription_id,
  );

  const { data, isLoading } = useGetKpiPenaltySelectedBuildingGraphDataQuery(
    {
      es_subscription_id,
      level1,
      level2,
      level3,
    },
    {
      skip: !es_subscription_id || !level1 || !level2 || !level3,
    },
  );

  /* ---------------- API Graph Data ---------------- */
  const KpiPenaltyData = data?.graph_data || [];

  /* ---------------- Map API Data ---------------- */
  const chartData = useMemo(
    () =>
      KpiPenaltyData?.map((item) => ({
        month: item.label.charAt(0), // F, M, A...
        value: item.total_penalty ?? 0,
      })),
    [KpiPenaltyData],
  );

  if (isLoading) {
    return (
      <div className="h-[280px] flex items-center justify-center text-sm">
        Loading chart...
      </div>
    );
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={280} className="mt-10 -ml-5">
        <BarChart data={chartData} barCategoryGap={6}>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            fontSize={12}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0, "dataMax + 50"]}
            fontSize={12}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
            shared={false}
          />

          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            fill="url(#responsePattern)"
            opacity={hoverStatus ? 0.3 : 1}
          />

          {/* Gradient Pattern */}
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

      {/* ---------------- Custom Legend ---------------- */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <span
          onMouseEnter={() => setHoverStatus("penalty")}
          onMouseLeave={() => setHoverStatus(null)}
          className="flex items-center gap-1 cursor-pointer"
        >
          <span className="w-3 h-3 border-2 border-[#1F98B2] rounded-full" />
          KPI Penalty ($)
        </span>
      </div>
    </>
  );
};

export default KpiPenaltyChart;
