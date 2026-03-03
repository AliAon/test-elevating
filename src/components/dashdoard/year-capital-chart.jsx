import { Loader } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const formatPrice = (value) => {
  if (!value) return "";
  return value > 10000 ? Math.round(value / 1000) + "K" : value;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const formatted =
      value >= 1_000_000
        ? `$${(value / 1_000_000).toFixed(2)}M`
        : value >= 1_0_000
          ? `$${Math.round(value / 1_000)}K`
          : `$${value}`;
    return (
      <div className="bg-black text-white text-xs px-2 py-1 rounded">
        {formatted}
      </div>
    );
  }
  return null;
};
export default function YearCapital({ data = [], isLoading }) {
  const maxValue = Math.max(...data.map((d) => d.total_cost));
  const yAxisMax = Math.ceil(maxValue / 100000) * 100000;

  return (
    <div className="w-full mt-10 ml-5">
      {isLoading ? (
        <div className="h-full flex items-center justify-center min-h-60">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} barCategoryGap={8}>
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                fontSize={12}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, yAxisMax]}
                fontSize={12}
                orientation="right"
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
                shared={false}
              />
              <Bar
                barSize={20}
                dataKey="total_cost"
                fill="url(#costPattern)"
                radius={[4, 4, 4, 4]}
              />
              <defs>
                <pattern
                  id="costPattern"
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

          <div className="flex justify-center mt-3 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#248EA5] to-[#dff9ff]"></span>
              Total Cost
            </span>
          </div>
        </>
      )}
    </div>
  );
}
