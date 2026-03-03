import React from "react";
import { View, Text, StyleSheet, Svg, Rect, Line } from "@react-pdf/renderer";

const CHART_HEIGHT = 180;

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 16 },
  legend: { flexDirection: "row", justifyContent: "center", marginTop: 12 },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  legendColor: { width: 10, height: 10, borderRadius: 2, marginRight: 6 },
  legendText: { fontSize: 9 },
  note: { marginTop: 10, textAlign: "center", fontSize: 9, color: "#4B5563" },
});

export default function CapitalBudgetPDF({ data }) {
  const currentYear = new Date().getFullYear();
  const recommendedYear = data?.recomended_replacement_year || currentYear + 5;
  const maxValue = Math.max(data?.max_price || 0, data?.min_price || 0, 1);

  const chartData = Array.from({ length: 10 }, (_, index) => {
    const year = currentYear + index;
    return {
      year,
      min: year === recommendedYear ? data?.min_price || 0 : 0,
      max: year === recommendedYear ? data?.max_price || 0 : 0,
      isRecommended: year === recommendedYear,
    };
  });

  const scale = (value) => Math.max((value / maxValue) * CHART_HEIGHT, 2);

  const chartWidth = 42 * chartData.length + 10; // 42 per column + 10 gap
  const barWidth = 10;
  const gap = 10;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Capital Budget</Text>

      <Svg width={chartWidth + 40} height={CHART_HEIGHT + 40}>
        {/* Y Axis */}
        <Line x1={30} y1={0} x2={30} y2={CHART_HEIGHT} stroke="#E5E7EB" />
        {/* X Axis */}
        <Line
          x1={30}
          y1={CHART_HEIGHT}
          x2={chartWidth + 30}
          y2={CHART_HEIGHT}
          stroke="#E5E7EB"
        />

        {/* Bars */}
        {chartData.map((item, index) => {
          const x = 30 + index * (barWidth * 2 + gap);
          const minBarHeight = scale(item.min);
          const maxBarHeight = scale(item.max);

          return (
            <React.Fragment key={item.year}>
              {/* Optional highlight for recommended year */}
              {item.isRecommended && (
                <Rect
                  x={x - 4}
                  y={0}
                  width={barWidth * 2 + 8}
                  height={CHART_HEIGHT}
                  fill="#E5F6FA"
                />
              )}

              {/* Min Bar */}
              <Rect
                x={x}
                y={CHART_HEIGHT - minBarHeight}
                width={barWidth}
                height={minBarHeight}
                fill="#1F98B2"
                rx={2}
              />
              {/* Max Bar */}
              <Rect
                x={x + barWidth + 4}
                y={CHART_HEIGHT - maxBarHeight}
                width={barWidth}
                height={maxBarHeight}
                fill="#8CAA00"
                rx={2}
              />

              {/* Year Label */}
              <Text x={x - 2} y={CHART_HEIGHT + 2} fontSize={8} fill="#6B7280">
                {item.year}
              </Text>
            </React.Fragment>
          );
        })}

        {/* Y Axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((fraction, i) => {
          const y = CHART_HEIGHT - CHART_HEIGHT * fraction;
          return (
            <React.Fragment key={i}>
              <Text x={0} y={y - 3} fontSize={7} fill="#6B7280">
                ${Math.round(maxValue * fraction).toLocaleString()}
              </Text>
              {/* Optional grid line */}
              <Line
                x1={30}
                y1={y}
                x2={chartWidth + 30}
                y2={y}
                stroke="#E5E7EB"
                strokeDasharray="2,2"
              />
            </React.Fragment>
          );
        })}
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#1F98B2" }]} />
          <Text style={styles.legendText}>Min Budget</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#8CAA00" }]} />
          <Text style={styles.legendText}>Max Budget</Text>
        </View>
      </View>

      {data?.recomended_replacement_year && (
        <Text style={styles.note}>
          Recommended Replacement Year:{" "}
          <Text style={{ fontWeight: "bold" }}>
            {data.recomended_replacement_year}
          </Text>
        </Text>
      )}
    </View>
  );
}
