import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import React from "react";
import { Loader } from "lucide-react";

// ------------------- PIE CHART -------------------
function EquipmentPieChart({ data = [] }) {
  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            startAngle={180}
            endAngle={0}
            cx="50%"
            cy="100%"
            innerRadius={135}
            outerRadius={150}
            stroke="none"
            paddingAngle={2}
            cornerRadius={8}
            isAnimationActive={true}
          >
            {data?.map((item, index) => (
              <Cell
                key={`slice-${index}`}
                fill={item.fill || "#cccccc"} // fallback color
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ------------------- MAIN COMPONENT -------------------
export default function KPIPaneltyDistribution({
  total_callbacks,
  downtime_percentage,
  isLoading,
  total_trapped_events,
  selectedMonth,
}) {
  const totalBudget = total_callbacks;

  // Chart Data
  const chartData = [
    // {
    //   name: "Callback",
    //   value: 100 - downtime_percentage,
    //   fill: "#F06B3C",
    // },
    { name: "Downtime", value: downtime_percentage, fill: "#B468B9" },
  ];

  return (
    <div className="w-[420px] h-auto flex flex-col justify-between bg-bg_primary rounded-xl p-6">
      <div>
        <p className="text-2xl font-semibold text-center text-black mb-2">
          KPI Performance
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="relative">
            {/* Pass dynamic data */}
            <EquipmentPieChart data={chartData} />

            {/* Center text */}
            <div className="absolute top-30 left-1/2 -translate-x-1/2 text-center">
              <p className="text-5xl font-semibold text-text_primary">
                {Intl.NumberFormat().format(totalBudget ?? 0)}
              </p>
              <p className="text-base text-text_secondary font-semibold">
                Total Callbacks
              </p>
              <p className="text-xs text-text_secondary font-medium">
                {total_trapped_events} Trapped Passenger in {selectedMonth}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2  gap-2 mt-14 w-1/2 mx-auto">
        {chartData?.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-white py-2 rounded-lg"
          >
            <div
              className="inline-block w-[3px] h-5 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <div>
              <p className="text-xs text-text_secondary font-medium">
                {item.name}
              </p>
              <p className="text-sm text-text_primary font-medium">
                {item.value ?? 0}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
