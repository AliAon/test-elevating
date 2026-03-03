import { Loader } from "lucide-react";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  ReferenceDot,
} from "recharts";

const CustomTooltip = ({ active, payload, activeRange }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white text-xs px-2 py-1 rounded-full">
        {activeRange === "year" ? payload[0].value : payload[0].value}
      </div>
    );
  }
  return null;
};

const Callback = ({ data = [], activeRange, isLoading, isFetching }) => {
  const [hoverStatus, setHoverStatus] = useState(null);
  const data1 = data?.[0]?.data;
  const data2 = data?.[1]?.data;
  const callbackdata = data1?.concat(data2);

  const result = Object.values(
    data.reduce((acc, { year, data }) => {
      if (!acc[year]) {
        acc[year] = { year, count: 0, target: 0 };
      }

      data.forEach(({ count, target }) => {
        acc[year].count += count;
        acc[year].target = target;
      });

      return acc;
    }, {}),
  );

  const chartData =
    activeRange === "year"
      ? callbackdata?.map((item) => ({
          month: item.month,
          value: item.count,
          target: item.target,
        })) || []
      : result?.map((item) => ({
          month: item?.year?.toString(),
          value: item?.count,
          target: item?.target,
        }));

  // Get Maximum target value
  const array = chartData?.map((item) => Number(item.target));
  const targetMax = Math?.max(...array);
  const valueArray = chartData?.map((item) => Number(item.value));
  const valueMax = Math?.max(...valueArray);
  const domainValue = valueMax > targetMax ? valueMax + 1 : targetMax + 1;
  return (
    <>
      {isLoading || isFetching ? (
        <div className="h-full flex items-center justify-center min-h-60">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <>
          <ResponsiveContainer
            width="100%"
            height={280}
            className="mt-10 -ml-5"
          >
            <BarChart data={chartData} barCategoryGap={15}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis
                domain={[0, domainValue]}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip activeRange={activeRange} />}
                cursor={{ fill: "transparent" }}
                shared={false}
              />
              <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={23}>
                {chartData?.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.value >= entry.target
                        ? "url(#goodPattern)"
                        : "url(#underPattern)"
                    }
                  />
                ))}
              </Bar>

              {chartData?.map((entry, index) => {
                if (!entry?.target || entry.target <= 0) return null;

                return (
                  <ReferenceDot
                    key={`limit-${index}`}
                    x={entry.month}
                    y={entry.target}
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
              <defs>
                <pattern
                  id="limitPattern"
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                  patternTransform="rotate(45)"
                >
                  <rect width="8" height="8" fill="#C2285A" />
                  <rect width="4" height="8" fill="rgba(255,255,255,0.3)" />
                </pattern>
                <pattern
                  id="underPattern"
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                  patternTransform="rotate(45)"
                >
                  <rect width="8" height="8" fill="#248EA5" />
                  <rect width="4" height="8" fill="rgba(255,255,255,0.25)" />
                </pattern>
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
                  id="criticalPattern"
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                  patternTransform="rotate(45)"
                >
                  <rect width="8" height="8" fill="#C2285A" />
                  <rect width="4" height="8" fill="rgba(255,255,255,0.25)" />
                </pattern>
              </defs>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            {/* <span
              className="flex items-center gap-1 cursor-pointer"
              onMouseEnter={() => setHoverStatus("limit")}
              onMouseLeave={() => setHoverStatus(null)}
            >
              <span className="w-3 h-3 border-2 border-black rounded-full"></span>
              Limit
            </span> */}
            <span
              className="flex items-center gap-1 cursor-pointer"
              onMouseEnter={() => setHoverStatus("under")}
              onMouseLeave={() => setHoverStatus(null)}
            >
              <span className="w-3 h-3 border-2 border-[#248EA5] rounded-full"></span>
              Under Limit
            </span>
            <span
              className="flex items-center gap-1 cursor-pointer"
              onMouseEnter={() => setHoverStatus("critical")}
              onMouseLeave={() => setHoverStatus(null)}
            >
              <span className="w-3 h-3 border-2 border-[#C2285A] rounded-full"></span>
              Critical
            </span>
          </div>
        </>
      )}
    </>
  );
};

export default Callback;
