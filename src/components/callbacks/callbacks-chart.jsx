import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceDot,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0]?.value ?? 0;

    return (
      <div className="bg-black shadow-lg rounded-lg p-2 text-xs">
        <p className="text-sm font-semibold mb-1 text-white">{label}</p>

        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[#248EA5] rounded-full"></span>
            <span className="text-white">Callbacks</span>
          </span>
          <span className="text-white font-medium">{value}</span>
        </div>
      </div>
    );
  }
  return null;
};

const CallbacksChart = ({ data = [], setSelectedMonth }) => {
  const formattedData = data?.map((item) => {
    const date = new Date(item?.month + "-01");
    const month = date.toLocaleString("en-US", { month: "short" });
    const limit = 100;

    return {
      month,
      callbacks: item?.callbacks_count,
      fullMonth: item?.month,
      limit,
    };
  });

  return (
    <div className="flex-1 bg-bg_primary rounded-xl p-6">
      <div>
        <div className="items-center gap-2 mt-1">
          <p className="text-2xl text-black font-semibold">Callbacks</p>
          <p className="mt-1 bg-[#EAECEF] rounded-full text-xs text-text_secondary font-medium px-2 py-1 w-30 text-center">
            in last 12 months
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280} className="mt-10 -ml-5">
        <BarChart data={formattedData} barCategoryGap={15}>
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
            shared={false}
          />

          <Bar
            dataKey="callbacks"
            radius={[8, 8, 8, 8]}
            barSize={23}
            onClick={(data) =>
              setSelectedMonth && setSelectedMonth(data?.payload?.fullMonth)
            }
            className="cursor-pointer"
          >
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.callbacks > entry.limit
                    ? "url(#goodPattern)"
                    : "url(#callbackPattern)"
                }
              />
            ))}
          </Bar>
          {formattedData?.map((entry, index) => (
            <ReferenceDot
              key={`limit-${index}`}
              x={entry.month}
              y={entry.limit}
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
          ))}

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
              <rect width="8" height="8" fill="#C2285A" />
              <rect width="4" height="8" fill="rgba(255,255,255,0.3)" />
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
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-[#248EA5] rounded-full"></span>
          Callbacks
        </span>
      </div>
    </div>
  );
};

export default CallbacksChart;
