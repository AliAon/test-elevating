import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useGetLast12MonthsQuery } from "@/redux/services/response-time";

export default function AverageResponseTimeCircleChartDistribution({
  level1,
  level2,
  level3,
  serviceContract,
  subscription_id,
}) {
  const { data: last12Months, isLoading } = useGetLast12MonthsQuery({
    es_subscription_id: subscription_id,
  });

  const percentage = last12Months?.data?.percentage || {};
  const equipmentStatus = last12Months?.data?.equipmentStatus || {};

  // Pie data for each level
  const pieData = {
    pil: [
      {
        name: "PIL",
        value: percentage.PIL,
        fill: percentage.PIL >= 100 ? "#248EA5" : "#DC6B43",
      },
      {
        name: "PIL Remaining",
        value: 100 - percentage.PIL,
        fill: "#D3D3D3",
      },
    ],
    stopped: [
      {
        name: "Stopped",
        value: percentage.Stopped,
        fill: percentage.Stopped >= 100 ? "#248EA5" : "#DC6B43",
      },
      {
        name: "Stopped Remaining",
        value: 100 - percentage.Stopped,
        fill: "#D3D3D3",
      },
    ],
    erratic: [
      {
        name: "Erratic",
        value: percentage.Erratic,
        fill: percentage.Erratic >= 100 ? "#248EA5" : "#DC6B43",
      },
      {
        name: "Erratic Remaining",
        value: 100 - percentage.Erratic,
        fill: "#D3D3D3",
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="w-[380px] h-[380px] flex items-center justify-center animate-pulse">
        <div className="w-[180px] h-[180px] bg-gray-300 rounded-full" />
      </div>
    );
  }

  return (
    <div className="w-[380px] rounded-xl bg-bg_primary p-6">
      <p className="text-2xl font-semibold text-center text-black mb-2">
        Average Response Time
      </p>

      <div className="relative w-full h-[300px]">
        <PieChart width={300} height={300}>
          {/* Innermost pie (PIL) */}
          <Pie
            data={pieData.pil}
            dataKey="value"
            cx="50%"
            cy="100%"
            innerRadius={45}
            outerRadius={75}
            cornerRadius={2}
            startAngle={180} // start from left
            endAngle={0} // fill clockwise to right
            isAnimationActive={true}
          >
            {pieData.pil.map((entry, index) => (
              <Cell key={`slice-${index}`} fill={entry.fill} />
            ))}
          </Pie>

          {/* Middle pie (Stopped) */}
          <Pie
            data={pieData.stopped}
            dataKey="value"
            cx="50%"
            cy="100%"
            innerRadius={80}
            outerRadius={110}
            cornerRadius={2}
            startAngle={180} // start from left
            endAngle={0} // fill clockwise to right
            isAnimationActive={true}
          >
            {pieData.stopped.map((entry, index) => (
              <Cell key={`slice-${index}`} fill={entry.fill} />
            ))}{" "}
          </Pie>

          {/* Outermost pie (Erratic) */}
          <Pie
            data={pieData.erratic}
            dataKey="value"
            cx="50%"
            cy="100%"
            innerRadius={115}
            outerRadius={150}
            cornerRadius={2}
            startAngle={180} // start from left
            endAngle={0} // fill clockwise to right
            isAnimationActive={true}
          >
            {pieData.erratic.map((entry, index) => (
              <Cell key={`slice-${index}`} fill={entry.fill} />
            ))}{" "}
          </Pie>

          <Tooltip shared={false} />
        </PieChart>

        {/* Center label */}
        <div className="absolute bottom-0 left-1/2 -translate-x-[100%]  text-center">
          <p className="text-xl font-semibold text-text_primary">
            {equipmentStatus.total}
          </p>
          <p className="text-sm text-text_secondary font-medium">Total</p>
        </div>
      </div>
    </div>
  );
}
