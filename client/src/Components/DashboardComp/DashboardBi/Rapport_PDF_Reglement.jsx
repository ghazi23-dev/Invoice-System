import { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
  Image,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import NunitoRegular from "../../../../assets/Fonts/Nunito-Regular.ttf";
import NunitoExtraBold from "../../../../assets/Fonts/Nunito-ExtraBold.ttf";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Logo from "../../../../assets/Logaris.png";
import { Button } from "antd";
import { DownloadOutlined, LoadingOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../Auth/AxiosInstance";
import LogoOlive from "../../../../assets/Olive_Logaris.png";
import "./Reglement.css";

// Define styles
Font.register({
  family: "Nunito",
  fonts: [
    { src: NunitoRegular, fontWeight: "normal" },
    { src: NunitoExtraBold, fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 20, textAlign: "center", marginBottom: 20 },
  subtitle: { fontSize: 1, marginBottom: 10 },
  tableHeader: {
    backgroundColor: "#cccccc",
    flexDirection: "row",
    fontFamily: "Nunito",
    borderBottomWidth: 1.2,
    borderTop: 1,
    borderBottomColor: "#aaaaaa",
    fontWeight: "bold",
    marginTop: 5,
    
  },
  tableCell: { flex: 1, padding: 5, fontSize: 8,fontFamily: "Nunito",fontWeight: "bold", },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#aaaaaa",
    marginLeft: 4,
  },
  totalCell: {
    flex: 1,
    padding: 5,
    fontSize: 9,
    fontFamily: "Nunito",
    fontWeight: "bold",
  },
  tableCol: {
    width: "12%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 10,
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: "Nunito",
    color: "grey",
    fontWeight: "bold",
  },
  headuser: {
    textAlign: "center",
    fontSize: "8px",
    position: "absolute",
    bottom: "120%",
    left: "75%",
    fontFamily: "Nunito",
    color: "black",
    fontWeight: "bold",
  },
  leftitle: { fontSize: 13, textAlign: "left", marginBottom: 20 },
  info :{
   
    fontWeight : 'bold',
    fontSize : '7px',
    fontFamily: "Nunito",

      },
      
});

const Rapport_PDF_Reglement = () => {
  const [data, setData] = useState(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [pdfDocument, setPdfDocument] = useState(null);
  const datetimenow =
    new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
  const [localdata, setLocalData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profilSociete, setProfilSociete] = useState(null);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const decodedToken = jwtDecode(token); // Decode the JWT
      const { fullname } = decodedToken;
      setLocalData({ fullname });
      console.log("User details from token:", { fullname });
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
  
    try {
      const response = await AxiosInstance.get("/Api/getallreglement", {
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      });
      setData(response.data);
      console.log("Data from servers:", response.data);

      const profilSocieteResponse = await AxiosInstance.get(`/Api/getParamSociete`);
      setProfilSociete(profilSocieteResponse.data);
     console.log("Profil Societe Data:", profilSocieteResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setData("No Reglement Found");
      setLoading(false);
    
    }
  };

  const renderProfilSocieteInfo = (profilSociete) => {
    return (
      <View style={{ 
        position: 'absolute', bottom: 5, left: 0,  right: 0, justifyContent: 'center', alignItems: 'center' }} fixed>
        {profilSociete && profilSociete.result && (
          <>
            <Text style={styles.info}>
              {profilSociete.result.nom_else} | Adresse: {profilSociete.result.adresse} | Tel: {profilSociete.result.numero_tel} | MF : {profilSociete.result.matricule} | Email : {profilSociete.result.email} | Banque : {profilSociete.result.nom_banque} | IBAN : {profilSociete.result.rib_bancaire}
            </Text>
          </>
        )}
      </View>
    );
  };
  const title = startDate && endDate ? `Extrait Des Réglements ${startDate} ${endDate}` : `Extrait Des Réglements ${datetimenow}`;


  const renderPDFDocument = () => {
    if (!data || data.includes("No Reglement Found")) {
      return (
        // No Reglement Found
        <Document
          title={title}
        >
          <Page style={styles.page}>
            <View>
              <Image src={Logo} style={{ width: 70 }} />
              <Image src={LogoOlive} style={{ width: 35, position: 'absolute', top: 0, right: 0 }} />
              <Text style={styles.title}>Extrait Des Réglements</Text>
              <Text style={styles.leftitle}>
                {startDate} - {endDate}
              </Text>

              <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>Date</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>
                    Désignation
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1.3 }]}>
                    Mode Reglement
                  </Text>

                  <Text style={[styles.tableCell, { flex: 0.8 }]}>Agent</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>Qty Olive</Text>
                  <Text style={[styles.tableCell, { flex: 0.9 }]}>Montant Total</Text>
                </View>

                {/* Table Body */}
                <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                  No Reglement Found
                </Text>
                {/* Total Row */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.totalCell, { flex: 1 }]}>Total</Text>
                  <Text style={[styles.totalCell, { flex: 0.18 }]}>0 KG</Text>
                  <Text style={[styles.totalCell, { flex: 0.15 }]}>0 D.T</Text>
                </View>
              </View>
            </View>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) =>
                `${pageNumber} / ${totalPages}`
              }
          

            />
             {renderProfilSocieteInfo(profilSociete)}
          </Page>
         
        </Document>
      );
    }

    // Perform reduce operations and return PDF content
    const totalAmount = data
      .reduce((total, item) => total + parseFloat(item.montant_total), 0).toFixed(3);
    const totalKg = data
      .reduce((total, item) => total + parseFloat(item.qte_olive), 0)
      .toFixed(3);
    
    return (
      <Document  title={title}>
        {" "}
        <Page style={styles.page}>
          <View>
            <Image src={Logo} style={{ width: 70, marginTop: 0 }} />
            <Image src={LogoOlive} style={{ width: 45, position: 'absolute', top: 25, right: 0 }}/>
            <Text style={styles.title}>Extrait Des Réglements</Text>
           
          <Text style={styles.leftitle}>
            {startDate} - {endDate}
          </Text>
      
  
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader} fixed>
                <Text style={[styles.tableCell, { flex: 2 }]}>Date</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>Désignation</Text>
                <Text style={[styles.tableCell, { flex: 1.3 }]}>
                  Mode Reglement
                </Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Agent</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>Qty Olive</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  Montant Total
                </Text>
              </View>

              <Text style={styles.headuser}>
                Imprimé Par :{" "}
                {localdata.fullname ? localdata.fullname : "LocalUser"}
                {"\n"}
                Date: {new Date().toLocaleDateString()} Heure:{" "}
                {new Date().toLocaleTimeString()}
              </Text>

              {/* Table Body */}
              {data.map((ticket, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>
                    {ticket.date_reglement}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { position: "relative", right: 20, flex: 2.5 },
                    ]}
                  >
                    {ticket.designation}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {ticket.mode_reglement}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {ticket.fullname}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { position: "relative", left: 10 },
                    ]}
                  >
                    {ticket.qte_olive}
                  </Text>{" "}
                  <Text
                    style={[
                      styles.tableCell,
                      { position: "relative", left: 15 },
                    ]}
                  >
                    {ticket.montant_total}
                  </Text>
                </View>
              ))}

              {/* Total Row */}
              <View style={styles.tableHeader}>
                <Text style={[styles.totalCell, { flex: 1 }]}>Total</Text>
                <Text style={[styles.totalCell, { flex: 0.18 }]}>{totalKg} KG</Text>
                <Text style={[styles.totalCell, { flex: 0.18 }]}>{totalAmount} D.T</Text>
              </View>
            </View>
          </View>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            fixed
          />
                {renderProfilSocieteInfo(profilSociete)}
        </Page>
        
      </Document>
    );
  };
  useEffect(() => {
    if (data && data.length > 0) {
      setPdfDocument(renderPDFDocument());
    }
  }, [data]);

  const handlereset = () => {
    setStartDate(null);
    setEndDate(null);
    setShowPDFPreview(false);
  }
  return (
    <div>
      <h1>Extrait Réglements</h1>
      <div className="ExtraitDate" style={{ display: "flex" }}>
        <div>
          <p> date de début :</p>
          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <p>Date de fin:</p>
          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <div className="resetFilters">
            <Button type="primary" onClick={handlereset}>Reset</Button>
          </div>
       
          <Button
            className="pdfpreview"
            onClick={async () => {
              await fetchData();
              setShowPDFPreview(true);
            }}
          >
            Preview PDF
          </Button>
          
        </div>
      
        </div>
       {!loading && showPDFPreview && pdfDocument && (
        <PDFViewer width="100%" height="685">
          {pdfDocument}
        </PDFViewer>
       )}

       <div>
        {showPDFPreview && (
          <PDFDownloadLink
            style={{ position: "absolute", top: "19%", right: "1%" }}
            document={pdfDocument}
            fileName={"Extrait Des Réglements " + datetimenow}
          >
            {({ loading }) =>
              loading ? (
                <LoadingOutlined style={{position:"relative", fontSize: "40px", color: "black" }} />
              ) : (
                <DownloadOutlined style={{position:"relative",fontSize: "40px", color: "black" }} />

              )
            }
          </PDFDownloadLink>
        )}
      
      </div>
      </div>

  );
};

export default Rapport_PDF_Reglement;
