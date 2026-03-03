import { View, Text } from "@react-pdf/renderer";
import { pdfStyles } from "./pdfStyles";

const PDFDetailCard = ({ title, value }) => {
  if (value === null || value === undefined || value === "") return null;

  return (
    <View style={pdfStyles.card}>
      <Text style={pdfStyles.label}>{title}</Text>
      <Text style={pdfStyles.value}>{value}</Text>
    </View>
  );
};

export default PDFDetailCard;
