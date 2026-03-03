import { useGetClientDashboardMonthlyMaintenanceQuery } from "@/redux/services/dashboard-api";
import { useSelector } from "react-redux";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
  ReferenceLine,
  Label,
  ReferenceDot,
} from "recharts";

const PlannedMaintenanceChart = ({ activeRange }) => {
  const { subscription_id } = useSelector((state) => state.subscription_id);

  const { data: maintenanceData } =
    useGetClientDashboardMonthlyMaintenanceQuery(
      {
        es_subscription_id: subscription_id,
        tab: activeRange,
      },
      {
        skip: !subscription_id,
      },
    );
  const responseData = maintenanceData?.data ?? [];

  // 🔥 Convert API → recharts format with single field "Maintenance"
  const apiChartData = responseData?.map((item) => ({
    month: activeRange == "3year" ? item.year : item.month,
    Maintenance: item.percentage ?? 0, // single field
    limit: 100,
  }));

  // fallback if no API data
  const chartData = apiChartData?.length > 0 ? apiChartData : [];

  return (
    <>
      <ResponsiveContainer width="100%" height={280} className={"mt-10 pl-5"}>
        <BarChart data={chartData}>
          <CartesianGrid stroke="#f0f0f0" vertical={false} />

          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />

          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "9999px",
              fontSize: "12px",
              padding: "2px 8px",
            }}
            shared={false}
            formatter={(value) => [`${value}%`, "Maintenance"]}
          />

          {/* Single Bar */}
          <Bar
            dataKey="Maintenance"
            fill="url(#pattern-stripe)"
            radius={[6, 6, 0, 0]}
          />
          {chartData?.map((entry, index) => (
            <ReferenceDot
              key={`limit-${index}`}
              x={entry.month}
              y={entry.limit}
              isFront
              shape={(props) => {
                const { cx, cy } = props;
                return (
                  <rect
                    x={cx - 13}
                    y={cy - -10}
                    width={25}
                    height={6}
                    rx={4}
                    fill="#000"
                    stroke="#fff"
                    strokeWidth={1.5}
                  />
                );
              }}
            />
          ))}

          {/* Stripe Pattern */}
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
              id="pattern-stripe"
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="3" height="6" fill="#84cc16" />
            </pattern>
          </defs>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-3 text-sm">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 border-2 border-[#84cc16] rounded-full"></span>
          Maintenance
        </span>
      </div>
    </>
  );
};

export default PlannedMaintenanceChart;
