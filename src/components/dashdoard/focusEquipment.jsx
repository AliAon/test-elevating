import { Loader } from "lucide-react";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const hoveredBar = payload[0];
    const equipmentName = hoveredBar?.payload?.name;
    const callbackCount = hoveredBar?.value;

    return (
      <div className="bg-black text-white text-xs px-3 py-2 rounded-md">
        <p className="font-medium">{equipmentName}</p>
        <p>Callbacks: {callbackCount}</p>
      </div>
    );
  }
  return null;
};

const FocusEquipment = ({ data = [], isLoading, isFetching }) => {
  const [hoverStatus, setHoverStatus] = useState(null);
  const [equipmentData, setEquipmentData] = useState([]);

  useEffect(() => {
    const formattedData = data?.map((item) => ({
      name: item.equipment_name,
      value: item.count,
      type: item.count > 0 ? "callback" : "limit",
      Limit: item.target,
    }));

    setEquipmentData(formattedData);
  }, [data]);

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
            <BarChart data={equipmentData} barCategoryGap={5}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[
                  0,
                  Math.max(...equipmentData.map((d) => d.value), 10) + 10,
                ]}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
                shared={false}
              />

              <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={18}>
                {equipmentData?.map((entry, index) => {
                  const isDimmed = hoverStatus && hoverStatus !== entry.type;

                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.value >= entry.Limit
                          ? "url(#goodPattern)"
                          : "url(#callbackPattern)"
                      }
                      fillOpacity={isDimmed ? 0.3 : 1}
                    />
                  );
                })}
              </Bar>

              {equipmentData?.map((entry, index) => {
                // if (!entry?.target || entry.target <= 0) return null;

                return (
                  <ReferenceDot
                    key={`limit-${index}`}
                    x={entry.name}
                    y={entry.Limit}
                    isFront
                    shape={(props) => {
                      const { cx, cy } = props;
                      return (
                        <rect
                          x={cx - 13}
                          y={cy - 0}
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
                  id="callbackPattern"
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
            <span
              onMouseEnter={() => setHoverStatus("limit")}
              onMouseLeave={() => setHoverStatus(null)}
              className="flex items-center gap-1"
            >
              <span className="w-3 h-3 border-2 border-black rounded-full"></span>
              Limit
            </span>
            <span
              onMouseEnter={() => setHoverStatus("callback")}
              onMouseLeave={() => setHoverStatus(null)}
              className="flex items-center gap-1"
            >
              <span className="w-3 h-3 border-2 border-[#1F98B2] rounded-full"></span>
              Callbacks
            </span>
          </div>
        </>
      )}
    </>
  );
};

export default FocusEquipment;
