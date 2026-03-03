import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import React from "react";

const COLOR_MAP = {
  ELEVATOR: "#FFB375",
  ESCALATOR: "#B468B9",
  "MOVING WALK": "#248EA5",
  OTHER: "#1F98B2",
};

function transformChartData(apiData = []) {
  const totalBudget = apiData.reduce((sum, item) => sum + item.total_cost, 0);

  return apiData.map((item) => ({
    name: item.equipment_type,
    value: Number(((item.total_cost / totalBudget) * 100).toFixed(1)),
    fill: COLOR_MAP[item.equipment_type] || "#999",
  }));
}

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
            {data.map((entry, index) => (
              <Cell key={`slice-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function BudgetDistribution({ data = [] }) {
  const chartData = transformChartData(data);

  const totalBudget = data.reduce((sum, item) => sum + item.total_cost, 0);

  return (
    <div className="w-[420px] h-auto flex flex-col justify-between bg-bg_primary rounded-xl p-6">
      <div>
        <p className="text-2xl font-semibold text-center text-black mb-2">
          Budget Distribution
        </p>

        <div className="relative">
          <EquipmentPieChart data={chartData} />

          <div className="absolute top-30 left-1/2 -translate-x-1/2 text-center">
            <p className="text-2xl font-semibold text-text_primary">
              {Intl.NumberFormat().format(totalBudget)}
            </p>
            <p className="text-base text-text_secondary font-semibold">
              Budget
            </p>
            <p className="text-xs text-text_secondary font-medium">
              in next 20 years
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-14 w-full">
        {chartData.map((item, index) => (
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
                {item.value}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
