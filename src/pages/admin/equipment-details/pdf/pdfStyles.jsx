import { StyleSheet } from "@react-pdf/renderer";

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  card: {
    width: "32%",
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#F6F6F8",
  },
  label: {
    fontSize: 9,
    color: "#6B7280",
  },
  value: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "bold",
  },
});
