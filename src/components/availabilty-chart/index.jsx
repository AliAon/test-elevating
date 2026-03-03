import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import React from "react";
import { useGetClientDashboardAvailbilityResponseQuery } from "@/redux/services/dashboard-api";
import { useSelector } from "react-redux";

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
            innerRadius={125}
            outerRadius={140}
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

export default function AvailabiltyChartDistribution({
  level1,
  level2,
  level3,
  serviceContract,
}) {
  const es_subscription_id = useSelector(
    (state) => state.subscription_id.subscription_id,
  );

  const { data: apiResponse, isLoading } =
    useGetClientDashboardAvailbilityResponseQuery(
      {
        es_subscription_id,
        level1: level1?.level1_id,
        level2: level2?.level2_id,
        level3,
        serviceContract,
      },
      {
        skip: !es_subscription_id || !level1 || !level2 || !level3,
      },
    );

  const availability = apiResponse?.data?.["12_month_availability"] ?? 0;

  const chartData = [
    { name: "Availablity", value: availability, fill: "#248EA5" },
    { name: "Un-availablity", value: 100 - availability, fill: "#F06B3C" },
  ];

  return (
    <div className="w-full h-auto flex flex-col justify-between bg-gray-50 shadow rounded-lg p-6">
      <div>
        <p className="text-2xl font-semibold text-black mb-2">
          Equipment Availability
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
                    {availability.toFixed(1)}%
                  </p>
                  <p className="text-base text-text_secondary font-semibold">
                    Availablity
                  </p>
                  <p className="text-xs text-text_secondary font-medium">
                    in for last 12 months
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
        <div className="grid grid-cols-2 gap-2 mt-14 mx-auto">
          {chartData?.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white py-2 rounded min-w-[120px] shadow"
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
