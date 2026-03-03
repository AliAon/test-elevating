import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import SpecificationInformationPDF from "./SpecificationInformationPDF";
import KpiParametersPDF from "./KpiParametersPDF";
import CapitalBudgetPDF from "./CapitalBudgetPDF";
import ContractInformationPDF from "@/components/equipments/equipment-details/ContractInformationPDF";
const list = [
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

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: "Helvetica",
  },

  row: {
    flexDirection: "row",
    gap: 16,
  },

  imageWrapper: {
    width: 150,
    height: 150,
    border: "1px solid #EAECEF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 12,
  },

  rightSection: {
    flex: 1,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  subtitleRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
    flexWrap: "wrap",
  },

  subtitle: {
    fontSize: 9,
    color: "#6B7280",
  },

  badge: {
    backgroundColor: "#EAECEF",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 8,
    color: "#5B617F",
  },

  section: {
    marginTop: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  card: {
    width: "32%",
    border: "1px solid #EAECEF",
    borderRadius: 8,
    padding: 8,
  },

  cardTitle: {
    fontSize: 8,
    color: "#6B7280",
    marginBottom: 2,
  },

  cardValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
  },

  descriptionCard: {
    marginTop: 10,
    border: "1px solid #EAECEF",
    borderRadius: 8,
    padding: 10,
  },
});

const DetailCard = ({ title, value }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value || "-"}</Text>
  </View>
);

export default function EquipmentDetailsPDF({ data }) {
  const equipment = data;

  return (
    <Document>
      <Page size="A3" style={styles.page}>
        <View style={styles.row}>
          {/* Left Image */}
          <View style={styles.imageWrapper}>
            <Image src="/assets/png/equip-1.png" style={styles.image} />
          </View>

          {/* Right Content */}
          <View style={styles.rightSection}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.title}>{equipment?.equipment_name}</Text>

                <View style={styles.subtitleRow}>
                  <Text style={styles.subtitle}>
                    EN 81-20 / EN 81-50 (Base Compliance)
                  </Text>
                  <Text style={styles.badge}>Fire Lift</Text>
                </View>
              </View>
            </View>

            {/* Details Grid */}
            <View style={styles.section}>
              <View style={styles.grid}>
                <DetailCard
                  title="Client Equipment Number"
                  value={equipment?.client_equipment_number}
                />
                <DetailCard
                  title="ES Pulse Equipment Number"
                  value={equipment?.es_pulse_equipment_number}
                />
                <DetailCard
                  title="OEM Service Equipment Number"
                  value={equipment?.oem_service_equipment_number}
                />
                <DetailCard
                  title="Design Code"
                  value={equipment?.design_code}
                />
                <DetailCard
                  title="Plant Registration Date"
                  value={(() => {
                      const raw = equipment?.plant_registration_date;
                      if (!raw) return "-";
                      const d = new Date(raw);
                      if (Number.isNaN(d.getTime())) return "-";
                      return d.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                      });
                    })()}
                />
                <DetailCard
                  title="Installed On"
                  value={equipment?.year_of_installation}
                />
                <DetailCard
                  title="Latest Modernisation Date"
                  value={
                    equipment?.last_modernization_date
                      ? new Date(
                          equipment.last_modernization_date
                        ).toLocaleDateString()
                      : "-"
                  }
                />
                <DetailCard
                  title="Speed (m/s)"
                  value={
                    equipment?.specification?.speed
                      ? `${Number(equipment.specification.speed).toFixed(
                          2
                        )} m/s`
                      : "-"
                  }
                />
                <DetailCard
                  title="Height"
                  value={
                    equipment?.specification?.height
                      ? `${equipment.specification.height} m`
                      : "-"
                  }
                />
                <DetailCard
                  title="Floor"
                  value={
                    equipment?.specification
                      ? `${equipment.specification.floor_from} to ${equipment.specification.floor_to}`
                      : "-"
                  }
                />
                <DetailCard
                  title="Equipment Life"
                  value={
                    equipment?.equipment_life
                      ? `${equipment.equipment_life} years`
                      : "-"
                  }
                />
                <DetailCard
                  title="Equipment Type"
                  value={equipment?.equipment_type}
                />
                <DetailCard
                  title="Model Number"
                  value={equipment?.model_number}
                />
                <DetailCard title="Group Name" value={equipment?.group_name} />
                <DetailCard title="Brand Name" value={equipment?.brand_name} />
                <DetailCard
                  title="Subscription Name"
                  value={equipment?.subscription_name}
                />
              </View>

              {/* Description */}
              <View style={styles.descriptionCard}>
                <Text style={styles.cardTitle}>Description</Text>
                <Text style={styles.cardValue}>
                  Machine-room-less (MRL) passenger elevator with
                  energy-efficient gearless traction technology. Designed for
                  mid-rise residential and commercial buildings.
                </Text>
              </View>
            </View>
          </View>
        </View>
        <SpecificationInformationPDF specification={equipment.specification} />
        <KpiParametersPDF list={list} />
        <CapitalBudgetPDF data={equipment.capital_budget} />
        <ContractInformationPDF
          contractinformation={equipment.linked_contracts}
        />
      </Page>
    </Document>
  );
}
