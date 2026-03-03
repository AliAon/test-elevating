import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

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
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  card: {
    width: "32%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 10,
  },

  cardTitle: {
    fontSize: 9,
    color: "#6B7280",
    fontWeight: "medium",
  },

  cardValue: {
    fontSize: 10,
    color: "#111827",
    fontWeight: "bold",
    marginTop: 4,
  },
});

const Card = ({ title, value }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value || "-"}</Text>
  </View>
);

export default function SpecificationInformationPDF({
  specification = {},
  equipment_type,
}) {
  const ELEVATOR = [
    { title: "Controller Model", value: specification.controller_model },
    { title: "Suspension Type", value: specification.suspension_type },
    {
      title: "Door Controller Brand",
      value: specification.door_controller_brand,
    },
    {
      title: "Door Controller Model",
      value: specification.door_controller_model,
    },
    { title: "In-Car Media Brand", value: specification.in_car_media_brand },
    { title: "In-Car Media Model", value: specification.in_car_media_model },
    { title: "Function Type", value: specification.function_type },
    { title: "Design Type", value: specification.design_type },
    {
      title: "Speed",
      value: specification.speed
        ? `${specification.speed} Miles Per Hour`
        : "-",
    },
    { title: "Max Load", value: specification.max_load },
    {
      title: "Length",
      value: specification.length ? `${specification.length} Meter` : "-",
    },
    {
      title: "Width",
      value: specification.width ? `${specification.width} Meter` : "-",
    },
    {
      title: "Height",
      value: specification.height ? `${specification.height} Feet` : "-",
    },
    { title: "Floor From", value: specification.floor_from },
    { title: "Floor To", value: specification.floor_to },
    {
      title: "Stops",
      value: specification.stops ? `Maximum ${specification.stops}` : "-",
    },
    { title: "Travel", value: specification.travel },
    { title: "Drive Model", value: specification.drive_model },
  ];

  const ESCALATOR = [
    { title: "Inclination", value: specification.inclination },
    { title: "Controller Model", value: specification.controller_model },
    { title: "Floor From", value: specification.floor_from },
    {
      title: "Width",
      value: specification.width ? `${specification.width} Meter` : "-",
    },
    { title: "Drive Model", value: specification.drive_model },
    { title: "Floor To", value: specification.floor_to },
    { title: "Design Type", value: specification.design_type },
    {
      title: "Speed",
      value: specification.speed
        ? `${specification.speed} Miles Per Hour`
        : "-",
    },
    {
      title: "Height",
      value: specification.height ? `${specification.height} Feet` : "-",
    },
  ];

  const list = equipment_type === "ELEVATOR" ? ELEVATOR : ESCALATOR;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Specification Information</Text>

      <View style={styles.grid}>
        {list.map((item, index) => (
          <Card key={index} title={item.title} value={item.value} />
        ))}
      </View>
    </View>
  );
}
