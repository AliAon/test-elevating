import React, { useState } from "react";
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
const tabs = [
  { key: "3-years", title: "3 Years" },
  { key: "5-years", title: "5 Years" },
  { key: "10 yearly", title: "10 Yearly" },
];
export default function KpiPenaltyEquipmentDetails() {
  return (
    <div>
      <div className="flex items-start gap-5">
        <div className="w-[328px] h-[530px] flex items-center justify-center border border-[#EAECEF] rounded-2xl">
          <img src="/assets/png/equip-1.png" alt="" className="w-full h-full" />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl text-text_primary font-semibold">
                KONE MonoSpace® 500 DX
              </p>
              <div className="flex items-center gap-1 mt-1">
                <p className="text-sm text-text_secondary font-medium">
                  EN 81-20 / EN 81-50 (Base Compliance)
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-8">
            <div className="grid grid-cols-3 gap-2">
              <DetailCard title="Design Code" value="EN 81-20 / EN 81-50" />
              <DetailCard title="Plant Registration Date" value="12/08/2021" />
              <DetailCard
                title="Manufacturer"
                value="KONE Corporation, Finland"
              />
              <DetailCard title="Installed On" value="2022" />
              <DetailCard
                title="Latest Modernisation Date"
                value="2025 (Controller, Door Operators) "
              />
              <DetailCard title="Sub-Type" value="MRL (Machine Room Less)" />
              <DetailCard title="Purpose" value="Passenger" />
              <DetailCard title="Capacity (in KGs)" value="450 kg – 1600 kg" />
              <DetailCard title="Stops" value="Up to 24 stops" />
              <DetailCard title="Speed (in m/s)" value="1.0 m/s – 1.75 m/s" />
              <DetailCard title="Height" value="Up to ~75 m" />
              <DetailCard title="Floor" value="Basement (B2) to 12th Floor" />
            </div>
            <DetailCard
              title="Description"
              value="Machine-room-less (MRL) passenger elevator with energy-efficient gearless traction technology. Designed for mid-rise residential and commercial buildings."
            />
          </div>
        </div>
      </div>

      <CapitalBudget />
      <ContractInformation />
    </div>
  );
}

const DetailCard = ({ title, value }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4">
      <p className="text-sm text-text_secondary font-medium">{title}</p>
      <p className="text-sm text-text_primary font-medium mt-1">{value}</p>
    </div>
  );
};

function ContractInformation() {
  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <p className="text-2xl font-semibold text-black">Contract Information</p>

      <div className="grid grid-cols-3 gap-2 mt-8">
        <Card title="Contract Number" value={"CN-2021-0458"} />
        <Card title="Contract Name" value={"MonoSpace 500 DX-AMC"} />
        <Card title="Service Provider" value={"KONE Elevators UAE Pvt. Ltd."} />
        <Card title="Start Date" value={"01/09/2022"} />
        <Card title="End Date" value={"31/08/2027"} />
        <Card title="Contract Status" value={"Active (Renewed for 5 years)"} />
        <Card title="Maintenance Visit (per year)" value="12 visits" />
        <Card title="Callback Rate (per year)" value="2 breakdowns" />
        <Card title="Availability" value="99.6% uptime" />
      </div>
    </div>
  );
}

const Card = ({ title, value }) => {
  return (
    <div className="bg-white rounded-2xl p-4">
      <p className="text-sm text-text_secondary font-medium">{title}</p>
      <p className="text-sm text-text_primary font-medium mt-1">{value}</p>
    </div>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const minPrice = payload.find((p) => p.dataKey === "minPrice");
    const maxPrice = payload.find((p) => p.dataKey === "maxPrice");

    return (
      <div className="bg-black text-white text-xs px-3 py-2 rounded-lg space-y-1">
        {minPrice && <div>Min Budget: ${minPrice.value.toLocaleString()}</div>}
        {maxPrice && <div>Max Budget: ${maxPrice.value.toLocaleString()}</div>}
      </div>
    );
  }
  return null;
};

function CapitalBudget() {
  const startYear = 2025;
  const endYear = 2035;

  const [activeIndex, setActiveIndex] = useState(2); // Default 10-Yearly tab

  // Generate dummy chart data
  const chartData = [];
  for (let year = startYear; year <= endYear; year++) {
    chartData.push({
      year: year.toString(),
      minPrice: Math.floor(Math.random() * 500_000), // 0 to 500k
      maxPrice: Math.floor(Math.random() * 1_000_000), // 0 to 1,000k
    });
  }

  const yAxisMax = 1_200_000; // Max 1.2M for padding

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-2xl text-black font-semibold">Capital Budget</p>
        <div className="w-fit">
          <div className="max-w-fit h-13 grid grid-cols-3 rounded-2xl bg-white p-1 mt-5">
            {tabs.map((tab, index) => (
              <button
                key={tab.key}
                onClick={() => setActiveIndex(index)}
                className={`h-full max-w-[200px] w-full text-sm font-medium cursor-pointer px-4 rounded-2xl transition-colors ${
                  activeIndex === index
                    ? "bg-bg_primary text-text_primary"
                    : "text-text_secondary"
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>
      </div>

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
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            orientation={"right"}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            domain={[0, yAxisMax]}
            tickFormatter={(value) => {
              if (value >= 1_000_000)
                return (value / 1_000_000).toFixed(1) + "M";
              if (value >= 1_000) return (value / 1_000).toFixed(0) + "k";
              return value;
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
            fill="#248EA5"
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 mt-4 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-[#1F98B2] rounded-full"></span>
          High Range
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-[#248EA5] rounded-full"></span>
          Low Range
        </span>
      </div>
    </div>
  );
}
