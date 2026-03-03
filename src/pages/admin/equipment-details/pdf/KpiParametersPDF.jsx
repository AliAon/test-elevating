import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },

  grid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  card: {
    width: "18%",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#FFFFFF",
  },

  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    width: 18,
    height: 18,
  },

  content: {
    marginTop: 10,
  },

  cardTitle: {
    fontSize: 9,
    color: "#111827",
    fontWeight: "medium",
  },

  cardValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 2,
  },

  cardTime: {
    fontSize: 8,
    color: "#6B7280",
    marginTop: 2,
  },
});

const DEFAULT_LIST = [
  {
    icon: "/assets/svg/equp-4.svg",
    icon_bg: "#C2285A26",
    title: "Callbacks",
    value: "28",
    time_left: "in last 12 months",
  },
  {
    icon: "/assets/svg/equp-5.svg",
    icon_bg: "#8CAA0026",
    title: "Availability",
    value: "93%",
    time_left: "in last 12 months",
  },
  {
    icon: "/assets/svg/equp-6.svg",
    icon_bg: "#F06B3C26",
    title: "Fulfilment",
    value: "100%",
    time_left: "in last 12 months",
  },
  {
    icon: "/assets/svg/equp-7.svg",
    icon_bg: "#1F98B226",
    title: "KPI Penalty",
    value: "2.5k",
    time_left: "in last 12 months",
  },
  {
    icon: "/assets/svg/equp-8.svg",
    icon_bg: "#B468B926",
    title: "Trapped Passenger",
    value: "49",
    time_left: "in last 12 months",
  },
];

const Card = ({ item }) => (
  <View style={styles.card}>
    <View style={[styles.iconWrapper, { backgroundColor: item.icon_bg }]}>
      <Image src={item.icon} style={styles.icon} />
    </View>

    <View style={styles.content}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardValue}>{item.value}</Text>
      <Text style={styles.cardTime}>{item.time_left}</Text>
    </View>
  </View>
);

export default function KpiParametersPDF({ list = DEFAULT_LIST }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>KPI Parameters</Text>

      <View style={styles.grid}>
        {list?.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </View>
    </View>
  );
}
