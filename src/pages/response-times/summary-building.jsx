import ResponseTimeChart from "@/components/dashdoard/ResponseTimeChart";
import { useGetClientDashboardAvgResponseQuery } from "@/redux/services/dashboard-api";
import { Loader, X } from "lucide-react";
import { useState } from "react";
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
            <span className="text-white">Minutes</span>
          </span>
          <span className="text-white font-medium">
            {Number(value).toFixed(2)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const SummaryResponseTimeChart = ({
  data = [],
  setSelectedMonth,
  serviceContract,
  isLoading,
  setLevel3,
  level1,
  level2,
  level3,
  subscription_id,
}) => {
  const [activeRange, setActiveRange] = useState("avg-response-minutes-time");

  const formattedData = data?.map((item) => {
    const date = new Date(item?.month + "-01");
    const month = date.toLocaleString("en-US", { month: "short" });

    return {
      month,
      callbacks: item?.avg_response_minutes,
      fullMonth: item?.month,
      limit: item?.callbacks_with_response_time,
    };
  });

  const {
    data: avgResponse,
    isLoading: isavgResponseLoading,
    isFetching: isavgResponseFetching,
  } = useGetClientDashboardAvgResponseQuery(
    {
      es_subscription_id: subscription_id,
      level1: level1?.level1_id,
      level2: level2?.level2_id,
      level3: level3,
      service_contract: serviceContract,
    },
    {
      skip: !subscription_id,
    },
  );

  return (
    <div className="relative flex-1 bg-bg_primary rounded-xl p-6">
      <button
        className="absolute top-5 right-5 cursor-pointer"
        onClick={() => {
          setSelectedMonth("");
          setLevel3("");
        }}
      >
        <X />
      </button>
      <div className="flex items-center justify-between">
        <div className="items-center gap-2 mt-1">
          <p className="text-2xl text-black font-semibold">Response Time</p>
          <p className="mt-1 bg-[#EAECEF] rounded-full text-xs text-text_secondary font-medium px-2 py-1 w-30 text-center">
            in last 12 months
          </p>
        </div>
        <div className="flex bg-white rounded-xl p-1 w-fit">
          {[
            {
              label: "Response Time",
              value: "avg-response-minutes-time",
            },
            {
              label: "Avg Response Time",
              value: "avg-response-percentage-time",
            },
          ].map((label) => (
            <button
              key={label.value}
              onClick={() => setActiveRange(label.value)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition
                      ${
                        activeRange === label.value
                          ? "bg-[#F3F3F3] shadow text-black"
                          : "text-[#5B617F] hover:text-black"
                      }`}
            >
              {label.label}
            </button>
          ))}
        </div>
      </div>
      {activeRange == "avg-response-minutes-time" && (
        <>
          {isLoading ? (
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
                    onClick={(data) => {
                      setSelectedMonth &&
                        setSelectedMonth(data?.payload?.fullMonth);
                    }}
                    className="cursor-pointer"
                  >
                    {formattedData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.callbacks > entry.limit
                            ? "url(#goodPattern)"
                            : "url(#callbacks)"
                        }
                      />
                    ))}
                  </Bar>

                  {formattedData.map((entry, index) => {
                    if (!entry?.target || entry.target <= 0) return null;

                    <ReferenceDot
                      key={index}
                      x={entry.month}
                      y={entry.limit}
                      isFront
                      shape={(props) => {
                        const { cx, cy } = props;
                        return (
                          <rect
                            x={cx - 15}
                            y={cy - 2}
                            width={28}
                            height={7}
                            rx={5}
                            fill="#000"
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        );
                      }}
                    />;
                  })}

                  <defs>
                    <pattern
                      id="goodPattern"
                      patternUnits="userSpaceOnUse"
                      width="8"
                      height="8"
                      patternTransform="rotate(45)"
                    >
                      <rect width="8" height="8" fill="#DC6B43" />
                      <rect
                        width="4"
                        height="8"
                        fill="rgba(255,255,255,0.25)"
                      />
                    </pattern>
                    <pattern
                      id="callbacks"
                      patternUnits="userSpaceOnUse"
                      width="8"
                      height="8"
                      patternTransform="rotate(45)"
                    >
                      <rect width="8" height="8" fill="#248EA5" />
                      <rect
                        width="4"
                        height="8"
                        fill="rgba(255,255,255,0.25)"
                      />
                    </pattern>
                  </defs>
                </BarChart>
              </ResponsiveContainer>

              <div className="flex justify-center gap-6 mt-4 text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-[#248EA5] rounded-full"></span>
                  Avg Minutes
                </span>
              </div>
            </>
          )}
        </>
      )}
      {activeRange == "avg-response-percentage-time" && (
        <ResponseTimeChart
          data={avgResponse?.data}
          isLoading={isavgResponseLoading}
          isFetching={isavgResponseFetching}
        />
      )}
    </div>
  );
};

export default SummaryResponseTimeChart;
