import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const minPrice = payload.find((p) => p.dataKey === "minPrice");
    const maxPrice = payload.find((p) => p.dataKey === "maxPrice");

    return (
      <div className="bg-black text-white text-xs px-3 py-2 rounded-lg space-y-1">
        {minPrice && minPrice.value > 0 && (
          <div>Min Budget: ${minPrice.value.toLocaleString()}</div>
        )}
        {maxPrice && maxPrice.value > 0 && (
          <div>Max Budget: ${maxPrice.value.toLocaleString()}</div>
        )}
      </div>
    );
  }
  return null;
};

export default function CapitalBudget({ data }) {
  const currentYear = new Date().getFullYear();
  const recommendedYear = data?.recomended_replacement_year || currentYear + 5;

  // Generate next 10 years of data
  const chartData = Array.from({ length: 10 }, (_, index) => {
    const year = currentYear + index;
    const isRecommendedYear = year === recommendedYear;

    return {
      year: year.toString(),
      maxPrice: isRecommendedYear ? data?.max_price || 0 : 0,
      minPrice: isRecommendedYear ? data?.min_price || 0 : 0,
    };
  });

  const maxValue = Math.max(data?.max_price || 0, data?.min_price || 0);
  const yAxisMax = maxValue > 0 ? Math.ceil(maxValue * 1.2) : 100;

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <p className="text-2xl font-semibold text-black mb-6">Capital Budget</p>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} barCategoryGap="20%">
          <CartesianGrid
            stroke="#E0E0E0"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            label={{
              value: "Years (Next 10 Years)",
              position: "insideBottom",
              offset: -5,
              style: { fontSize: 14, fontWeight: 600 },
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            domain={[0, yAxisMax]}
            label={{
              value: "Budget Range ($)",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 14, fontWeight: 600 },
            }}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
            shared={false}
          />

          <Bar
            dataKey="minPrice"
            barSize={40}
            radius={[8, 8, 0, 0]}
            fill="#1F98B2"
          />
          <Bar
            dataKey="maxPrice"
            barSize={40}
            radius={[8, 8, 0, 0]}
            fill="#DC6B43"
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 mt-4 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-[#1F98B2] rounded"></span>
          Min Budget
        </span>

        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-[#DC6B43] rounded"></span>
          Max Budget
        </span>
      </div>

      {data?.recomended_replacement_year && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Recommended Replacement Year:{" "}
          <span className="font-semibold text-gray-900">
            {data.recomended_replacement_year}
          </span>
        </div>
      )}
    </div>
  );
}
