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
  { key: "callbacks", title: "Callbacks" },
  { key: "trapped-passengers", title: "Trapped Passengers" },
];

const yearData = [
  { month: "Jan", penalty: 40, performed: 55, limit: 100 },
  { month: "Feb", penalty: 70, performed: 65, limit: 100 },
  { month: "Mar", penalty: 80, performed: 68, limit: 100 },
  { month: "Apr", penalty: 60, performed: 60, limit: 100 },
  { month: "May", penalty: 55, performed: 62, limit: 100 },
  { month: "Jun", penalty: 45, performed: 58, limit: 100 },
  { month: "Jul", penalty: 60, performed: 65, limit: 100 },
  { month: "Aug", penalty: 85, performed: 72, limit: 100 },
  { month: "Sep", penalty: 58, performed: 67, limit: 100 },
  { month: "Oct", penalty: 65, performed: 69, limit: 100 },
  { month: "Nov", penalty: 70, performed: 65, limit: 100 },
  { month: "Dec", penalty: 55, performed: 60, limit: 100 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const penalty = payload.find((p) => p.dataKey === "penalty")?.value;
    const performed = payload.find((p) => p.dataKey === "performed")?.value;
    const limit = payload.find((p) => p.dataKey === "limit")?.value;

    return (
      <div className="bg-black shadow-lg rounded-lg p-2 text-xs">
        <p className="text-sm font-semibold mb-1 text-white">{label}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="text-white">Limit</span>
            </span>
            <span className="text-white font-medium">{limit}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-[#248EA5] rounded-full"></span>
              <span className="text-white">Penalty</span>
            </span>
            <span className="text-white font-medium">{penalty}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-[#C2285A] rounded-full"></span>
              <span className="text-white">Performed</span>
            </span>
            <span className="text-white font-medium">{performed}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const SelectedBuildingResponseTimesForecast = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex-1 bg-bg_primary rounded-xl p-6">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-2xl text-black font-semibold">Response Time</p>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-2 bg-[#EAECEF] rounded-full w-fit px-4 py-2">
            in last 12 months
          </p>
        </div>
        <div className="w-fit">
          <div className="max-w-fit h-13 grid grid-cols-2 rounded-2xl bg-white p-1 mt-5  ">
            {tabs.map((tab, index) => (
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
        <BarChart data={yearData} barCategoryGap={15}>
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            ticks={[20, 40, 60, 80, 100]}
            orientation="right"
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
            shared={false}
          />

          <Bar dataKey="penalty" radius={[8, 8, 8, 8]} barSize={23}>
            {yearData.map((_, index) => (
              <Cell key={`cell-${index}`} fill="url(#penaltyPattern)" />
            ))}
          </Bar>

          <Line
            type="monotone"
            dataKey="performed"
            stroke="#C2285A"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="linear"
            dataKey="limit"
            stroke="#000000"
            strokeWidth={2}
            dot={false}
          />

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
          Callbacks
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 border-2 border-[#060606]  rounded-full"></span>
          Limits
        </span>

        <span className="flex items-center gap-1">
          <span className="w-3 h-3 border-2 border-[#C2285A]  rounded-full"></span>
          Performed
        </span>
      </div>
    </div>
  );
};

export default SelectedBuildingResponseTimesForecast;
