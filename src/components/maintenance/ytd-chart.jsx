import { Loader, X } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  Cell,
  ReferenceDot,
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
    const plannedRaw = payload.find((p) => p.dataKey === "planned")?.value;
    const performedRaw = payload.find((p) => p.dataKey === "performed")?.value;
    const onTimeRaw = payload.find((p) => p.dataKey === "onTime")?.value;
    const percentageRaw = payload.find(
      (p) => p.dataKey === "percentage",
    )?.value;

    const planned =
      typeof plannedRaw === "number" ? Math.round(plannedRaw) : plannedRaw;
    const performed =
      typeof performedRaw === "number"
        ? Math.round(performedRaw)
        : performedRaw;
    const onTime =
      typeof onTimeRaw === "number" ? Math.round(onTimeRaw) : onTimeRaw;
    const percentage =
      typeof percentageRaw === "number"
        ? Math.round(percentageRaw)
        : percentageRaw;

    return (
      <div className="bg-black shadow-lg rounded-lg p-2 text-xs">
        <p className="text-sm font-semibold mb-1 text-white">{label}</p>
        <div className="flex flex-col gap-1">
          {planned !== undefined && (
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#36495e] rounded-full"></span>
                <span className="text-white">Planned</span>
              </span>
              <span className="text-white font-medium">{planned}</span>
            </div>
          )}
          {performed !== undefined && (
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 border-2 border-[#248EA5] bg-[#DC6B43] rounded-full"></span>
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
          {percentage !== undefined && (
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#C2285A] rounded-full"></span>
                <span className="text-white">Percent</span>
              </span>
              <span className="text-white font-medium">{percentage}%</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const YtdMaintenanceChart = ({
  data,
  setSelectedMonth,
  setLevel3,
  isYtdLoading,
  isYtdFetching,
}) => {
  const formattedData = data?.map((item) => {
    const [year, month] = item.month.split("-");
    const limit = item?.target ?? 0;

    return {
      month: monthMap[Number(month) - 1],
      fullMonth: item.month,
      planned: item.planned_count,
      performed: item.performed_count,
      onTime: item.on_time_completed_count,
      percentage: item.percentage,
      limit,
    };
  });

  return (
    <div className="relative flex-1 bg-bg_primary rounded-xl p-6">
      {/* <button
        className="absolute top-5 right-5 cursor-pointer"
        onClick={() => setLevel3("")}
      >
        <X />
      </button> */}
      <div>
        <p className="text-xs text-text_secondary font-medium">
          LAST 12 MONTHS
        </p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-2xl text-black font-semibold">Maintenance</p>
          <p className="bg-[#EAECEF] rounded-full text-xs text-text_secondary font-medium px-2 py-1">
            YTD
          </p>
        </div>
      </div>

      {isYtdLoading || isYtdFetching ? (
        <div className="flex items-center justify-center h-full">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <>
          <ResponsiveContainer
            width="100%"
            height={280}
            className="mt-10 -ml-5"
          >
            <BarChart data={formattedData} barCategoryGap={15}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                domain={[0, 100]}
                tickFormatter={(v) =>
                  typeof v === "number" && !Number.isInteger(v)
                    ? `${Math.round(v)}%`
                    : `${v}%`
                }
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
                shared={false}
              />

              {/* PLANNED BAR */}
              <Bar
                dataKey="planned"
                yAxisId="left"
                radius={[8, 8, 0, 0]}
                barSize={23}
                onClick={(data) =>
                  setSelectedMonth && setSelectedMonth(data.payload.fullMonth)
                }
                className="cursor-pointer"
              >
                {formattedData?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.planned
                        ? "url(#limitPattern)"
                        : "url(#plannedPattern)"
                    }
                  />
                ))}
              </Bar>

              {/* PERFORMED BAR */}
              <Bar
                dataKey="performed"
                yAxisId="left"
                radius={[8, 8, 0, 0]}
                barSize={23}
                onClick={(data) =>
                  setSelectedMonth && setSelectedMonth(data.payload.fullMonth)
                }
                className="cursor-pointer"
              >
                {formattedData?.map((entry, index) => (
                  <Cell
                    key={`performed-cell-${index}`}
                    fill={
                      typeof entry.performed === "number" &&
                      typeof entry.planned === "number" &&
                      entry.performed >= entry.planned
                        ? "url(#plannedPattern)"
                        : "url(#goodPattern)"
                    }
                  />
                ))}
              </Bar>

              {/* ON TIME BAR */}
              <Bar
                dataKey="onTime"
                yAxisId="left"
                radius={[8, 8, 0, 0]}
                barSize={23}
                onClick={(data) =>
                  setSelectedMonth && setSelectedMonth(data.payload.fullMonth)
                }
                className="cursor-pointer"
              >
                {formattedData?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.onTime ? "url(#goodPattern)" : "url(#onTime)"}
                  />
                ))}
              </Bar>
              {formattedData?.map((entry, index) => {
                if (!entry?.limit || entry.limit <= 0) return null;
                return (
                  <ReferenceDot
                    key={`limit-${index}`}
                    x={entry.month}
                    y={entry.limit}
                    yAxisId="left"
                    isFront
                    shape={(props) => {
                      const { cx, cy } = props;
                      return (
                        <rect
                          x={cx - 13}
                          y={cy - -10}
                          width={25}
                          height={6}
                          rx={4}
                          fill="#000"
                          stroke="#fff"
                          strokeWidth={1.5}
                        />
                      );
                    }}
                  />
                );
              })}
              {/* PERFORMED LINE */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="percentage"
                stroke="#C2285A"
                strokeWidth={2}
                dot={false}
              />

              <defs>
                <pattern
                  id="goodPattern"
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                  patternTransform="rotate(45)"
                >
                  <rect width="8" height="8" fill="#DC6B43" />
                  <rect width="4" height="8" fill="rgba(255,255,255,0.25)" />
                </pattern>
                <pattern
                  id="limitPattern"
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                  patternTransform="rotate(45)"
                >
                  <rect width="8" height="8" fill="#36495e" />
                  <rect width="4" height="8" fill="rgba(255,255,255,0.3)" />
                </pattern>
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
              Achived (%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-[#36495e] rounded-full"></span>
              Planned
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border-3 border-[#1F98B2] bg-[#DC6B43] rounded-full"></span>
              Performed
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default YtdMaintenanceChart;
