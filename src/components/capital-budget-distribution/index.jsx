import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import React from "react";
import { useSelector } from "react-redux";
import { useGetCapitalDistributionQuery } from "@/redux/services/capital-buget-api";

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

export default function CapitalBudgetDistribution({ equiment_type }) {
  const es_subscription_id = useSelector(
    (state) => state.subscription_id.subscription_id,
  );
  const { data: distribution, isLoading } = useGetCapitalDistributionQuery(
    {
      es_subscription_id,
      equiment_type,
    },
    {
      skip: !es_subscription_id || !equiment_type,
    },
  );

  const under10Y_percentage = distribution?.data?.under10Y_percentage ?? 0;
  const total_equipment = distribution?.data?.total_equipment ?? 0;
  const chartData = [
    { name: "Within 10Y", value: under10Y_percentage, fill: "#F06B3C" },
    { name: "After 10Y", value: 100 - under10Y_percentage, fill: "#248EA5" },
  ];

  return (
    <div className="w-[420px] h-auto flex flex-col justify-between bg-bg_primary rounded-xl p-6">
      <div>
        <p className="text-xl font-semibold text-black mb-2">
          Equipment Replacement Distribution
        </p>

        <div className="relative">
          {/* ---------- SKELETON FOR CHART ---------- */}
          {isLoading ? (
            <div className="w-full h-[200px] flex items-center justify-center animate-pulse">
              <div className="w-[180px] h-[180px] bg-gray-300 rounded-full" />
            </div>
          ) : (
            <>
              <EquipmentPieChart data={chartData} />

              <div className="absolute top-30 left-[45%] -translate-x-[40%] text-center">
                <div className="w-full">
                  <p className="text-5xl font-semibold text-text_primary">
                    {total_equipment}
                  </p>
                  <p className="text-base text-text_secondary font-semibold">
                    Equipment
                  </p>
                  <p className="text-xs text-text_secondary font-medium">
                    in next 10 years
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ---------- LEGEND ---------- */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-2 mt-14 w-1/2 mx-auto animate-pulse">
          <div className="h-10 bg-gray-300 rounded-lg"></div>
          <div className="h-10 bg-gray-300 rounded-lg"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 mt-14 w-1/2 mx-auto">
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
                  {item.value.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
