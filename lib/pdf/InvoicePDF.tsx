import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { marked } from "marked";
import type { Tokens } from "marked";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxM.woff",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Roboto",
    fontSize: 12,
    lineHeight: 1.6,
  },
  h1: { fontSize: 20, marginBottom: 20, fontWeight: "bold" },
  h2: { fontSize: 16, marginBottom: 10, fontWeight: "bold" },
  p: { marginBottom: 8 },
  listItem: { marginLeft: 10, marginBottom: 4 },
  table: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeaderCell: {
    flex: 1,
    padding: 6,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  tableCell: {
    flex: 1,
    padding: 6,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  tableTotalRow: {
    flexDirection: "row",
    borderTopWidth: 2,
    borderTopColor: "#000",
  },
  tableTotalLabel: {
    flex: 3,
    padding: 6,
    textAlign: "right",
    fontWeight: "bold",
  },
  tableTotalValue: {
    flex: 1,
    padding: 6,
    textAlign: "right",
    fontWeight: "bold",
  },
});

type Props = {
  title: string;
  content: string;
};

const InvoicePDF = ({ title, content }: Props) => {
  const tokens = marked.lexer(content);

  const renderTokens = () =>
    tokens.map((token, i) => {
      if (token.type === "heading") {
        return (
          <Text key={i} style={token.depth === 1 ? styles.h1 : styles.h2}>
            {token.text}
          </Text>
        );
      }

      if (token.type === "paragraph") {
        return (
          <Text key={i} style={styles.p}>
            {token.text}
          </Text>
        );
      }

      if (token.type === "list") {
        const listToken = token as Tokens.List;
        return listToken.items.map((item: Tokens.ListItem, j) => (
          <Text key={`${i}-${j}`} style={styles.listItem}>
            • {item.text}
          </Text>
        ));
      }

      if (token.type === "table") {
        const tableToken = token as Tokens.Table;

        // Compute total from last column (assumes "$123.00")
        const total = tableToken.rows.reduce((acc, row) => {
          const value = row[row.length - 1].text.replace(/[^0-9.]/g, "");
          return acc + parseFloat(value || "0");
        }, 0);

        return (
          <View key={i} style={styles.table}>
            <View style={styles.tableRow}>
              {tableToken.header.map((cell, idx) => (
                <Text key={`h-${idx}`} style={styles.tableHeaderCell}>
                  {cell.text}
                </Text>
              ))}
            </View>

            {tableToken.rows.map((row, rIdx) => (
              <View key={`r-${rIdx}`} style={styles.tableRow}>
                {row.map((cell, cIdx) => (
                  <Text key={`c-${rIdx}-${cIdx}`} style={styles.tableCell}>
                    {cell.text}
                  </Text>
                ))}
              </View>
            ))}

            <View style={styles.tableTotalRow}>
              <Text style={styles.tableTotalLabel}>Total</Text>
              <Text style={styles.tableTotalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        );
      }

      return null;
    });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>{title}</Text>
        <View>{renderTokens()}</View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
