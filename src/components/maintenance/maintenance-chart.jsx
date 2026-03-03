import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  Cell,
} from "recharts";

const monthMap = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const planned = payload.find((p) => p.dataKey === "planned")?.value;
    const performed = payload.find((p) => p.dataKey === "performed")?.value;
    const onTime = payload.find((p) => p.dataKey === "onTime")?.value;

    return (
      <div className="bg-black shadow-lg rounded-lg p-2 text-xs">
        <p className="text-sm font-semibold mb-1 text-white">{label}</p>
        <div className="flex flex-col gap-1">
          {planned !== undefined && (
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#248EA5] rounded-full"></span>
                <span className="text-white">Planned</span>
              </span>
              <span className="text-white font-medium">{planned}</span>
            </div>
          )}
          {performed !== undefined && (
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#C2285A] rounded-full"></span>
                <span className="text-white">Performed</span>
              </span>
              <span className="text-white font-medium">{performed}</span>
            </div>
          )}
          {onTime !== undefined && (
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#1F98B2] rounded-full"></span>
                <span className="text-white">On Time</span>
              </span>
              <span className="text-white font-medium">{onTime}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const MaintenanceChart = ({ data, setSelectedMonth }) => {
  const formattedData = data?.map((item) => {
    const [year, month] = item.month.split("-");

    return {
      month: monthMap[Number(month) - 1],
      fullMonth: item.month,
      planned: item.planned_count,
      performed: item.performed_count,
      onTime: item.on_time_completed_count,
    };
  });

  return (
    <div className="flex-1 bg-bg_primary rounded-xl p-6">
      <div>
        <p className="text-xs text-text_secondary font-medium">
          for last 12 months
        </p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-2xl text-black font-semibold">Maintenance</p>
          <p className="bg-[#EAECEF] rounded-full text-xs text-text_secondary font-medium px-2 py-1">
            PPM
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280} className="mt-10 -ml-5">
        <BarChart data={formattedData} barCategoryGap={15}>
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} domain={[0, "auto"]} />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
            shared={false}
          />

          {/* PLANNED BAR */}
          <Bar
            dataKey="planned"
            radius={[8, 8, 0, 0]}
            barSize={23}
            onClick={(data) =>
              setSelectedMonth && setSelectedMonth(data.payload.fullMonth)
            }
            className="cursor-pointer"
          >
            {formattedData?.map((_, index) => (
              <Cell key={`cell-${index}`} fill="url(#plannedPattern)" />
            ))}
          </Bar>

          {/* ON TIME BAR */}
          <Bar
            dataKey="onTime"
            radius={[8, 8, 0, 0]}
            barSize={23}
            onClick={(data) =>
              setSelectedMonth && setSelectedMonth(data.payload.fullMonth)
            }
            className="cursor-pointer"
          >
            {formattedData?.map((_, index) => (
              <Cell key={`cell-${index}`} fill="url(#onTime)" />
            ))}
          </Bar>

          {/* PERFORMED LINE */}
          <Line
            type="monotone"
            dataKey="performed"
            stroke="#C2285A"
            strokeWidth={2}
            dot={false}
          />

          <defs>
            <pattern
              id="plannedPattern"
              patternUnits="userSpaceOnUse"
              width="8"
              height="8"
              patternTransform="rotate(45)"
            >
              <rect width="8" height="8" fill="#248EA5" />
              <rect width="4" height="8" fill="rgba(255,255,255,0.25)" />
            </pattern>
            <pattern
              id="onTime"
              patternUnits="userSpaceOnUse"
              width="8"
              height="8"
              patternTransform="rotate(45)"
            >
              <rect width="8" height="8" fill="#1F98B2" />
              <rect width="4" height="8" fill="rgba(255,255,255,0.25)" />
            </pattern>
          </defs>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 mt-4 text-sm">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 border-2 border-[#C2285A] rounded-full"></span>
          Performed
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 border-2 border-[#248EA5] rounded-full"></span>
          Planned
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 border-2 border-[#1F98B2] rounded-full"></span>
          On Time
        </span>
      </div>
    </div>
  );
};

export default MaintenanceChart;
