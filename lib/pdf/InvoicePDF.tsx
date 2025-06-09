/* eslint-disable jsx-a11y/alt-text */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { marked } from "marked";
import type { Tokens } from "marked";

// Register font
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
  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 40,
  },
  h1: { fontSize: 20, marginBottom: 20, fontWeight: "bold" },
  h2: { fontSize: 16, marginBottom: 10, fontWeight: "bold" },
  p: { marginBottom: 8 },
  listItem: { marginLeft: 10, marginBottom: 4 },
  meta: { marginBottom: 10 },
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
  summary: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  notes: {
    marginTop: 20,
    fontSize: 10,
    color: "#555",
  },
});

type Props = {
  title: string;
  content: string;
  clientName: string;
  clientEmail?: string;
  issueDate: string;
  dueDate: string;
  taxRate: number;
  discount: number;
  companyLogo?: string;
  notes?: string;
};

const InvoicePDF = ({
  title,
  content,
  clientName,
  clientEmail,
  issueDate,
  dueDate,
  taxRate,
  discount,
  companyLogo,
  notes,
}: Props) => {
  const tokens = marked.lexer(content);
  let subtotal = 0;

  const renderTokens = () =>
    tokens.map((token, i) => {
      if (token.type === "table") {
        const tableToken = token as Tokens.Table;

        tableToken.rows.forEach((row) => {
          const amount = parseFloat(row[3]?.text?.replace("$", "") || "0");
          subtotal += isNaN(amount) ? 0 : amount;
        });

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
          </View>
        );
      }

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

      return null;
    });

  const tax = subtotal * (taxRate / 100);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal + tax - discountAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.h1}>{title}</Text>
          {companyLogo ? <Image src={companyLogo} style={styles.logo} /> : null}
        </View>

        <View style={styles.meta}>
          <Text>Client: {clientName}</Text>
          {clientEmail && <Text>Email: {clientEmail}</Text>}
          <Text>Issue Date: {new Date(issueDate).toLocaleDateString()}</Text>
          <Text>Due Date: {new Date(dueDate).toLocaleDateString()}</Text>
        </View>

        <View>{renderTokens()}</View>

        <View style={styles.summary}>
          <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
          <Text>
            Tax ({taxRate}%): ${tax.toFixed(2)}
          </Text>
          <Text>
            Discount ({discount}%): -${discountAmount.toFixed(2)}
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 14 }}>
            Total: ${total.toFixed(2)}
          </Text>
        </View>

        {notes && <Text style={styles.notes}>Notes: {notes}</Text>}
      </Page>
    </Document>
  );
};

export default InvoicePDF;
