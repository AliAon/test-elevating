import React, { useState } from "react";
import {
  BarChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const responseData = [
  { month: "J", value: 50 },
  { month: "F", value: 100 },
  { month: "M", value: 80 },
  { month: "A", value: 90 },
  { month: "M", value: 60 },
  { month: "J", value: 70 },
  { month: "J", value: 110 },
  { month: "A", value: 95 },
  { month: "S", value: 65 },
  { month: "O", value: 100 },
  { month: "N", value: 75 },
  { month: "D", value: 80 },
];

const maintenanceDataYear = [
  { month: "Jan", Planned: 70, Performed: 65 },
  { month: "Feb", Planned: 90, Performed: 80 },
  { month: "Mar", Planned: 85, Performed: 70 },
  { month: "Apr", Planned: 80, Performed: 78 },
  { month: "May", Planned: 75, Performed: 68 },
  { month: "Jun", Planned: 60, Performed: 60 },
  { month: "Jul", Planned: 65, Performed: 70 },
  { month: "Aug", Planned: 95, Performed: 90 },
  { month: "Sep", Planned: 75, Performed: 72 },
  { month: "Oct", Planned: 85, Performed: 80 },
  { month: "Nov", Planned: 70, Performed: 65 },
  { month: "Dec", Planned: 68, Performed: 60 },
];

const maintenanceData3Year = [
  { month: "2021", Planned: 750, Performed: 700 },
  { month: "2022", Planned: 820, Performed: 770 },
  { month: "2023", Planned: 880, Performed: 820 },
];

const KPIDashboard = () => {
  const [view, setView] = useState("year");

  const data = view === "year" ? maintenanceDataYear : maintenanceData3Year;

  return (
    <div className="grid grid-cols-12 gap-6 py-6">
      {/* Response Time KPI - 4 cols */}
      <div className="bg-gray-50 shadow rounded-2xl p-4 col-span-12 md:col-span-4">
        <h2 className="text-lg font-semibold mb-4">Response Time KPI</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={responseData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 120]} />
            <Tooltip shared={false} />
            <Legend />
            <Bar
              dataKey="value"
              name="Response"
              fill="#38bdf8"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-2 text-sm">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-sky-400 inline-block rounded"></span>{" "}
            Response
          </span>
        </div>
      </div>

      {/* Planned Maintenance KPI - 8 cols */}
      <div className="bg-gray-50 shadow rounded-2xl p-4 col-span-12 md:col-span-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Planned Maintenance KPI</h2>
          {/* ⬇️ Replaced old buttons with pill-style toggle */}
          <div className="flex bg-gray-100 rounded-full p-1 w-fit">
            {[
              { key: "year", label: "Year" },
              { key: "3year", label: "3 Year" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`px-4 py-1 text-sm font-medium rounded-full transition
                  ${
                    view === key
                      ? "bg-white shadow text-black"
                      : "text-gray-500 hover:text-black"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis domain={[0, view === "year" ? 120 : 1000]} />
            <Tooltip shared={false} />
            <Legend />
            <Bar
              dataKey="Planned"
              fill="url(#pattern-stripe)"
              radius={[6, 6, 0, 0]}
            />
            <Line
              type="monotone"
              dataKey="Performed"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
            <defs>
              <pattern
                id="pattern-stripe"
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect
                  width="3"
                  height="6"
                  transform="translate(0,0)"
                  fill="#84cc16"
                ></rect>
              </pattern>
            </defs>
          </BarChart>
        </ResponsiveContainer>

        <div className="flex justify-center gap-6 mt-2 text-sm">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-lime-500 inline-block rounded"></span>{" "}
            Planned
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-500 inline-block rounded"></span>{" "}
            Performed
          </span>
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;
