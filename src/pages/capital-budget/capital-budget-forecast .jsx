import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const formatCurrency = (value) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString('en-AU')}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const budgets = payload.find((p) => p.dataKey === "budgets")?.value;
    const trends = payload.find((p) => p.dataKey === "trends")?.value;
    return (
      <div className="bg-black text-white rounded-lg p-2 text-xs">
        <p className="text-sm font-semibold mb-1">{label}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-[#248EA5] rounded-full"></span>Budgets
            </span>
            <span className="font-medium">{formatCurrency(budgets)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CapitalBudgetForecast = ({ data, setDate }) => {
  const chartData =
    data?.map((item) => ({
      year: item.year,
      budgets: item.total_cost,
    })) || [];

  const maxValue = Math.max(...chartData.map((item) => item.budgets), 0);

  const tickStep = Math.ceil(maxValue / 5);
  const ticks = Array.from({ length: 6 }, (_, i) => i * tickStep);

  return (
    <div className="flex-1 bg-bg_primary rounded-xl p-6">
      <div>
        <p className="text-2xl text-black font-semibold">
          Capital Budget Forecast
        </p>
        <p className="text-xs text-gray-500 font-medium mt-2">
          For Next 10 Years (avg. of low &amp; high estimates)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={280} className="mt-10">
        <BarChart data={chartData} barCategoryGap={15}>
          <XAxis dataKey="year" axisLine={false} tickLine={false} />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            ticks={ticks}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
            shared={false}
          />

          <Bar
            dataKey="budgets"
            radius={[8, 8, 8, 8]}
            barSize={20}
            onClick={(data) => {
              setDate && setDate(data.year);
            }}
            className="cursor-pointer"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill="url(#budgetPattern)" />
            ))}
          </Bar>

          <defs>
            <pattern
              id="budgetPattern"
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
          Budgets
        </span>
      </div>
    </div>
  );
};

export default CapitalBudgetForecast;
