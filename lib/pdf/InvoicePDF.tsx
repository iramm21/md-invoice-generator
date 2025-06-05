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
  },
  h1: { fontSize: 20, marginBottom: 10, fontWeight: "bold" },
  h2: { fontSize: 16, marginBottom: 8, fontWeight: "bold" },
  p: { marginBottom: 6 },
  listItem: { marginLeft: 10, marginBottom: 4 },
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
