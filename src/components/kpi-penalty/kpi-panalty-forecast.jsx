import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Line,
} from "recharts";

const tabs = [
  { key: "amount", title: "Amount" },
  { key: "callbacks", title: "Callbacks" },
  { key: "downtime", title: "Downtime" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const penalty = payload.find((p) => p.dataKey === "penalty")?.value;

    return (
      <div className="bg-black shadow-lg rounded-lg p-2 text-xs">
        <p className="text-sm font-semibold mb-1 text-white">{label}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-[#248EA5] rounded-full"></span>
              <span className="text-white">Penalty</span>
            </span>
            <span className="text-white font-medium">{penalty}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
const tabKeyMap = {
  amount: "total_penalty",
  callbacks: "callbacks",
  downtime: "downtime",
};

const KpiPanaltyForecast = ({ months, setSelectedMonth }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTabKey = tabs[activeIndex]?.key;
  const dataKey = tabKeyMap[activeTabKey];
  const chartData = months?.map((item) => ({
    month: item.month,
    penalty: item[dataKey] || 0,
  }));

  return (
    <div className="flex-1 bg-bg_primary rounded-xl p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium mt-2">
            for last 12 months
          </p>
          <div className="flex items-center gap-2">
            <p className="text-2xl text-black font-semibold">KPI Penalty</p>
            <p className="bg-[#EAECEF] py-1 px-2 rounded-full text-xs">PPM</p>
          </div>
        </div>
        <div className="w-fit">
          <div className="max-w-fit h-13 grid grid-cols-3 rounded-2xl bg-white p-1 mt-5  ">
            {tabs?.map((tab, index) => (
              <button
                onClick={() => {
                  setActiveIndex(index);
                }}
                key={tab.key}
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

      <ResponsiveContainer width="100%" height={280} className="mt-10 -ml-5">
        <BarChart data={chartData} barCategoryGap={15}>
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            ticks={[20, 40, 60, 80, 100]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
            shared={false}
          />
          <Bar
            dataKey="penalty"
            radius={[8, 8, 8, 8]}
            barSize={23}
            onClick={(data) => {
              setSelectedMonth(data?.month);
            }}
          >
            {chartData?.map((_, index) => (
              <Cell key={`cell-${index}`} fill="url(#penaltyPattern)" />
            ))}
          </Bar>
          <defs>
            <pattern
              id="penaltyPattern"
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

      <div className="flex justify-center gap-6 mt-4 text-sm">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 border-2 border-[#248EA5] rounded-full"></span>
          Penalty
        </span>
      </div>
    </div>
  );
};

export default KpiPanaltyForecast;
