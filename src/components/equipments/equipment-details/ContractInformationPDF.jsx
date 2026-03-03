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

export default function ContractInformationPDF({ contractinformation = {} }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Contract Information</Text>

      <View style={styles.grid}>
        <Card
          title="Contract Number"
          value={contractinformation.contract_number}
        />
        <Card title="Contract Name" value={contractinformation.contract_name} />
        <Card
          title="Service Provider"
          value={contractinformation.service_provider_name}
        />
        <Card
          title="Start Date"
          value={
            contractinformation.start_date
              ? new Date(contractinformation.start_date).toLocaleDateString()
              : "-"
          }
        />
        <Card
          title="End Date"
          value={
            contractinformation.end_date
              ? new Date(contractinformation.end_date).toLocaleDateString()
              : "-"
          }
        />
        <Card
          title="Contract Status"
          value={contractinformation.active ? "Active" : "Inactive"}
        />
        <Card
          title="Person Name"
          value={contractinformation.contact_person_name}
        />
        <Card title="Email" value={contractinformation.email} />
        <Card title="Contact Person" value={contractinformation.phone_no} />

        {/* Static KPI-like fields */}
        <Card title="Maintenance Visit (per year)" value="12 visits" />
        <Card title="Callback Rate (per year)" value="4 breakdowns" />
        <Card title="Availability" value="99.6% uptime" />
      </View>
    </View>
  );
}
