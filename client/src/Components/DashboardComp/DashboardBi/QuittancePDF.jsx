import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ToWords } from "to-words";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 48,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1f2937",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: "#0e7490",
  },
  companyName: { fontSize: 15, fontWeight: 700, color: "#0e7490" },
  companyMeta: { fontSize: 9, color: "#6b7280", marginTop: 2 },
  titleBlock: { alignItems: "flex-end" },
  title: { fontSize: 14, fontWeight: 700, letterSpacing: 1 },
  quittanceNumber: { fontSize: 10, color: "#6b7280", marginTop: 3 },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 20,
  },
  infoCard: {
    width: "49.2%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 9,
  },
  infoLabel: { fontSize: 8, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 },
  infoValue: { fontSize: 10, fontWeight: 700, marginTop: 3 },
  amountBox: {
    marginTop: 22,
    borderWidth: 2,
    borderColor: "#0e7490",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  amountLabel: { fontSize: 9, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 },
  amountValue: { fontSize: 24, fontWeight: 700, color: "#0e7490", marginTop: 6 },
  amountWords: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    fontSize: 9,
    textAlign: "center",
    color: "#374151",
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  contextCard: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 12,
  },
  contextRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  contextLabel: { fontSize: 9.5, color: "#6b7280" },
  contextValue: { fontSize: 9.5, fontWeight: 700 },
  footer: {
    position: "absolute",
    bottom: 36,
    left: 48,
    right: 48,
  },
  thanks: { fontSize: 9, color: "#6b7280", textAlign: "center" },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 26,
  },
  signatureBox: { width: "45%" },
  signatureLine: { marginTop: 26, borderTopWidth: 1, borderTopColor: "#9ca3af", paddingTop: 4 },
  signatureLabel: { fontSize: 8.5, color: "#6b7280", textAlign: "center" },
});

const fmt = (value) => `${Number(value || 0).toFixed(3)} DT`;

const QuittancePDF = ({ reglement, invoice }) => {
  const toWords = new ToWords({
    localeCode: "fr-FR",
    converterOptions: {
      currency: true,
      ignoreDecimal: true,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        name: "Dinar",
        plural: "Dinars",
        symbol: "TND",
        fractionalUnit: {
          name: "Millime",
          plural: "Millimes",
          symbol: "",
        },
      },
    },
  });

  const montant = Number(reglement.Montant || 0);
  const totalFacture = Number(invoice.TotalAmount || 0);
  const words = montant > 0 ? toWords.convert(montant) : "Zéro Dinar";

  return (
    <Document title={`Quittance N°: ${reglement.ReglementID}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow} fixed>
          <View>
            <Text style={styles.companyName}>STE KAYAN VOYAGES</Text>
            <Text style={styles.companyMeta}>Agence de voyages — Monastir</Text>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>QUITANCE DE PAIEMENT</Text>
            <Text style={styles.quittanceNumber}>N° {String(reglement.ReglementID).padStart(4, "0")}</Text>
          </View>
        </View>

        {/* Info grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Facture</Text>
            <Text style={styles.infoValue}>{invoice.invoiceNumber}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Client</Text>
            <Text style={styles.infoValue}>{invoice.customerName}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Date de règlement</Text>
            <Text style={styles.infoValue}>
              {new Date(reglement.DateReglement).toLocaleDateString("fr-FR")}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Mode de paiement</Text>
            <Text style={styles.infoValue}>{reglement.Mode}</Text>
          </View>
          {reglement.Reference && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Référence</Text>
              <Text style={styles.infoValue}>{reglement.Reference}</Text>
            </View>
          )}
        </View>

        {/* Amount */}
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Montant réglé</Text>
          <Text style={styles.amountValue}>{fmt(montant)}</Text>
          <Text style={styles.amountWords}>Arrêtée la présente quittance à la somme de : {words}</Text>
        </View>

        {/* Invoice context */}
        <View style={styles.contextCard}>
          <View style={styles.contextRow}>
            <Text style={styles.contextLabel}>Montant total de la facture</Text>
            <Text style={styles.contextValue}>{fmt(totalFacture)}</Text>
          </View>
          <View style={styles.contextRow}>
            <Text style={styles.contextLabel}>Reste à payer après ce règlement</Text>
            <Text style={styles.contextValue}>{fmt(reglement.resteApres)}</Text>
          </View>
        </View>

        {reglement.Notes && (
          <View style={styles.contextCard}>
            <Text style={styles.infoLabel}>Notes</Text>
            <Text style={{ fontSize: 9.5, marginTop: 4 }}>{reglement.Notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.thanks}>Merci de votre confiance.</Text>
          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureLabel}>Le client</Text>
              </View>
            </View>
            <View style={styles.signatureBox}>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureLabel}>Cachet &amp; Signature — STE KAYAN VOYAGES</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default QuittancePDF;
