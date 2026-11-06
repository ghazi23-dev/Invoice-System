/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import LogoKV from "../../../assets/KVLogo.png";
import { ToWords } from "to-words";
import QRCode from "qrcode";
import NunitoRegular from "../../../assets/Fonts/Nunito-Regular.ttf";
import NunitoExtraBold from "../../../assets/Fonts/Nunito-ExtraBold.ttf";
import stamp from "../../../assets/stamp.png";

const FactureAvoirComponent = ({ record }) => {
  const [localData, setLocalData] = useState("");
  const uniqueTaxes = [...new Set(record?.Items?.map((item) => item?.Tax) || [])];
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  useEffect(() => {
    Font.register({
      family: "Nunito",
      fonts: [
        { src: NunitoRegular, fontWeight: "normal" },
        { src: NunitoExtraBold, fontWeight: "bold" },
      ],
    });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails) {
      const { fullname } = userDetails;
      setLocalData(fullname);
    }
  }, []);

  useEffect(() => {
    if (!record || !record.client) return;

    QRCode.toDataURL(
      `STE KAYAN VOYAGES , Détail de la Facture d'Avoir:
      Client: ${record.client.ClientName || ''},
      Facture d'Avoir N°: ${record.invoiceNumber || ''},
      Date: ${formatDate(record.InvoiceDate || new Date())},
      Total TTC: ${Number(record.TotalAmount || 0).toFixed(3)},
      Total HT: ${Number(record.TotalHT || 0).toFixed(3)},
      Total TVA: ${Number(record.Tva || 0).toFixed(3)},
      Timbre Fiscal: ${Number(record.Timbre_Fiscal || 0).toFixed(3)},
      Agent de Saisie: ${localData || ''},
      Date de Saisie: ${formatDate(record.CreatedAt || new Date())},
      Systeme de Facturation: GSoft Innovations: Contacter Nous: https://www.linkedin.com/in/ghazi-smach/`
    )
      .then(setQrCodeDataUrl)
      .catch(console.error);
  }, [record, localData]);

  const amount = record.TotalAmount;

  const splitItemsIntoPages = (items, itemsPerPageFirst, itemsPerPage) => {
    const itemsPages = [];
    let remainingItems = [...items];

    if (remainingItems.length > itemsPerPageFirst) {
      itemsPages.push(remainingItems.slice(0, itemsPerPageFirst));
      remainingItems = remainingItems.slice(itemsPerPageFirst);
    } else {
      itemsPages.push(remainingItems);
      remainingItems = [];
    }

    while (remainingItems.length > 0) {
      itemsPages.push(remainingItems.slice(0, itemsPerPage));
      remainingItems = remainingItems.slice(itemsPerPage);
    }

    return itemsPages;
  };

  const ITEMS_PER_PAGE_FIRST = 20;
  const ITEMS_PER_PAGE = 25;
  const itemsPages = splitItemsIntoPages(
    record.Items || [],
    ITEMS_PER_PAGE_FIRST,
    ITEMS_PER_PAGE
  );

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

  const renderTableRows = (items) => {
    if (!items || !Array.isArray(items)) return null;

    return items.map((item, index) => (
      <View style={styles.tableRow} key={index}>
        <Text style={styles.tableCell}>{record?.referenceNumber || ''}</Text>
        <Text style={[styles.tableCell, styles.widerCell]}>{item?.Description || ''}</Text>
        <Text style={styles.tableCell}>{item?.Quantity || 0}</Text>
        <Text style={styles.tableCell}>{Number(item?.Rate || 0).toFixed(3)}</Text>
        <Text style={styles.tableCell}>{Number(item?.Amount || 0).toFixed(3)}</Text>
      </View>
    ));
  };

  return (
    <Document title={`Facture d'Avoir N°: ${record?.invoiceNumber || ''}`}>
      {itemsPages.map((items, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page} orientation="portrait">
          {pageIndex === 0 && (
            <>
              <View style={styles.header}>
                <Image src={LogoKV} style={styles.logo} />
                {qrCodeDataUrl && <Image src={qrCodeDataUrl} style={styles.qrCode} />}
              </View>
              <Text style={styles.invoiceTitleUI}>Facture d`Avoir N°: {record?.invoiceNumber}</Text>
              <View style={styles.details}>
                <View style={styles.detailsColumn}>
                  <Text style={styles.value}>KAYAN VOYAGES</Text>
                  <Text style={styles.value}>AV de La République Monastir 5060</Text>
                  <Text style={styles.value}>(+216)73501021</Text>
                  <Text style={styles.value}>MF: 1717704 R/A/M/000</Text>
                </View>
                <View style={styles.detailsColumn}>
                  <Text style={styles.value}>{record?.client?.ClientName}</Text>
                  <Text style={styles.value}>{record?.client?.ClientAddress}</Text>
                  <Text style={styles.value}>{record?.client?.ClientPhone}</Text>
                  <Text style={styles.value}>{record?.client?.Matricule_fiscale}</Text>
                </View>
              </View>
              <Text style={styles.labelDateFacture}>Monastir le {formatDate(record?.InvoiceDate)}</Text>
            </>
          )}

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>Référence</Text>
              <Text style={[styles.tableCell, styles.tableCellHeader, styles.widerCell]}>Désignation</Text>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>Quantité</Text>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>P.U</Text>
              <Text style={[styles.tableCell, styles.tableCellHeader]}>Montant Total</Text>
            </View>
            {renderTableRows(items)}
          </View>

          {pageIndex === itemsPages.length - 1 && (
            <>
              <View style={styles.calculations}>
                <Text style={styles.calculationsHeader}>Base de calcul de la TVA (Avoir)</Text>
                <View style={styles.calculationTable}>
                  <View style={styles.calculationRow}>
                    <Text style={styles.calculationLabel}>Base TVA</Text>
                    <Text style={styles.calculationLabel}>Remise</Text>
                    <Text style={styles.calculationLabel}>Taux TVA</Text>
                    <Text style={styles.calculationLabel}>Montant TVA</Text>
                  </View>
                  <View style={styles.calculationRow}>
                    <Text style={styles.calculationValue}>{Number(record?.TotalHT || 0).toFixed(3)}</Text>
                    <Text style={styles.calculationValue}>
                      {[
                        ...new Set(
                          record.Items.map((item) => {
                            if (item.DiscountType === "Percentage(%)") {
                              return `${item.Discount}%`;
                            } else if (item.DiscountType === "Flat") {
                              return `${Number(item.Discount).toFixed(3)} DT`;
                            }
                            return null;
                          })
                        ),
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </Text>
                    <Text style={styles.calculationValue}>{uniqueTaxes.join(", ")}%</Text>
                    <Text style={styles.calculationValue}>{Number(record?.Tva || 0).toFixed(3)}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.summaryContainer} wrap={false}>
                <View style={styles.summaryBox}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total HT:</Text>
                    <Text style={styles.summaryValue}>{Number(record?.TotalHT || 0).toFixed(3)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Remise:</Text>
                    <Text style={styles.summaryValue}>{Number(record.Discount).toFixed(3)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total TVA:</Text>
                    <Text style={styles.summaryValue}>{Number(record?.Tva || 0).toFixed(3)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Timbre Fiscal:</Text>
                    <Text style={styles.summaryValue}>{Number(record?.Timbre_Fiscal || 0).toFixed(3)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total TTC:</Text>
                    <Text style={styles.summaryValue}>{Number(record?.TotalAmount || 0).toFixed(3)}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.footerTextNumber}>
                Arrêtée la présente facture d`avoir à la somme de:{" "}
                {toWords.convert(amount, { currency: true }) +
                  " et " +
                  (amount % 1).toFixed(3).substring(2)}{" "}
                millimes
              </Text>
              <Image src={stamp} style={styles.stamp} />
            </>
          )}

          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>
              Banque: UIB | RIB: TN5912502000003302816642 | Code SWIFT: UIBKTNTT | Email: Contact@Kayanvoyages.tn | Tel: 73501021
            </Text>
            <Text style={styles.footerText}>
              Cette facture d`avoir annule et remplace la facture N° {record?.referenceNumber || ''} du {formatDate(record?.originalInvoiceDate || new Date())}
            </Text>
          </View>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            fixed
          />
        </Page>
      ))}
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottom: "1px solid #d32f2f",  // Changed to red theme for Avoir
    paddingBottom: 10,
  },
  logo: {
    width: 90,
    height: 90,
    objectFit: "contain",
  },
  qrCode: {
    width: 60,
    height: 60,
    position: "absolute",
    top: 15,
    right: 15,
  },
  invoiceTitleUI: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d32f2f",  // Changed to red theme for Avoir
    marginBottom: 10,
    fontFamily: "Helvetica",
    paddingBottom: 5,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#fff3f3",  // Light red background
    borderRadius: 4,
    border: "1px solid #ffcdd2",
  },
  detailsColumn: {
    width: "48%",
    padding: 8,
    backgroundColor: "#ffffff",
    borderRadius: 4,
    border: "1px solid #ffcdd2",
  },
  value: {
    fontSize: 9,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    marginBottom: 4,
    color: "#2c3e50",
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 4,
    overflow: "hidden",
    border: "1px solid #d32f2f",
  },
  tableHeader: {
    backgroundColor: "#d32f2f",
    minHeight: 20,
  },
  tableCellHeader: {
    color: "#ffffff",
    fontSize: 9,
    padding: 5,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ffcdd2",
    backgroundColor: "#ffffff",
    minHeight: 20,
  },
  tableCell: {
    flex: 1,
    padding: 4,
    fontSize: 8,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    color: "#2c3e50",
  },
  widerCell: {
    flex: 2.5,
    textAlign: "left",
    paddingLeft: 6,
  },
  calculations: {
    marginTop: 10,
    marginBottom: 10,
  },
  calculationsHeader: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 5,
  },
  calculationTable: {
    borderRadius: 4,
    overflow: "hidden",
    border: "1px solid #d32f2f",
  },
  calculationRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ffcdd2",
    backgroundColor: "#ffffff",
    minHeight: 18,
  },
  calculationLabel: {
    flex: 1,
    padding: 4,
    fontSize: 8,
    fontWeight: "bold",
    color: "#d32f2f",
    backgroundColor: "#fff3f3",
    textAlign: "center",
  },
  calculationValue: {
    flex: 1,
    padding: 4,
    fontSize: 8,
    color: "#2c3e50",
    textAlign: "center",
  },
  summaryContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  summaryBox: {
    width: "40%",
    alignSelf: "flex-end",
    backgroundColor: "#fff3f3",
    borderRadius: 4,
    border: "1px solid #d32f2f",
    padding: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ffcdd2",
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#d32f2f",
  },
  summaryValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  footerTextNumber: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#d32f2f",
    fontFamily: "Helvetica",
    fontStyle: "italic",
    textAlign: "left",
    padding: 8,
    backgroundColor: "#fff3f3",
    borderRadius: 4,
    border: "1px solid #ffcdd2",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    borderTop: "1px solid #d32f2f",
    paddingTop: 8,
    backgroundColor: "#ffffff",
  },
  footerText: {
    fontSize: 8,
    color: "#d32f2f",
    marginBottom: 3,
    lineHeight: 1.2,
  },
  stamp: {
    position: "relative",
    width: 160,
    height: 120,
    marginLeft: 'auto',
    marginRight: 30,
    marginTop: 10,
    opacity: 0.9,
  },
  labelDateFacture: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "right",
    color: "#d32f2f",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#d32f2f",
  }
});

export default FactureAvoirComponent; 