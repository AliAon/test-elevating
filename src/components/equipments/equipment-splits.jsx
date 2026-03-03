import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import React from "react";

function EquipmentPieChart({ chartData }) {
  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            data={chartData}
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
            {chartData.map((entry, index) => (
              <Cell key={`slice-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function EquipmentSplits({ splitData }) {
  const apiResponse = {
    elevators: {
      count: splitData?.splits?.elevators?.count,
      percentage: splitData?.splits?.elevators?.percentage,
    },
    escalators: {
      count: splitData?.splits?.escalators?.count,
      percentage: splitData?.splits?.escalators?.percentage,
    },
    moving_walks: {
      count: splitData?.splits?.moving_walks?.count,
      percentage: splitData?.splits?.moving_walks?.percentage,
    },
    other: {
      count: splitData?.splits?.other?.count,
      percentage: splitData?.splits?.other?.percentage,
    },
  };

  const chartData = [
    {
      name: "Elevators",
      value: apiResponse.elevators.percentage,
      fill: "#1F98B2",
    },
    {
      name: "Escalators",
      value: apiResponse.escalators.percentage,
      fill: "#F06B3C",
    },
    {
      name: "Moving Walks",
      value: apiResponse.moving_walks.percentage,
      fill: "#248EA5",
    },
    {
      name: "Other",
      value: apiResponse.other.percentage,
      fill: "#B468B9",
    },
  ];

  return (
    <div className="w-[420px] h-auto flex flex-col justify-between bg-bg_primary rounded-xl p-6">
      <div>
        <p className="text-2xl font-semibold text-center text-black mb-2">
          Equipment Splits
        </p>

        <div className="relative">
          <EquipmentPieChart chartData={chartData} />

          <div className="absolute top-25 left-1/2 -translate-x-1/2 text-center">
            <p className="text-4xl font-semibold text-text_primary">
              {splitData?.total_equipment}
            </p>
            <p className="text-base text-text_secondary font-semibold">
              Total Equipments
            </p>
            <p className="text-xs text-text_secondary font-medium">
              Last 12 months
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-14">
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
