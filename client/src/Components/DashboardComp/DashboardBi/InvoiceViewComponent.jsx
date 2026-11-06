import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, FileText, Hash, User } from "lucide-react";
import QRCode from "qrcode.react";
import axiosInstance from "../../../Auth/AxiosInstance";
import { PageHeader } from "@/Components/ui/page-header";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { PageLoader } from "@/Components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { formatAmount } from "@/lib/format";

const InfoItem = ({ label, value, icon: Icon }) => (
  <div className="rounded-xl border bg-card p-4">
    <p className="m-0 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </p>
    <p className="m-0 mt-1.5 truncate text-sm font-semibold">{value}</p>
  </div>
);

const TotalRow = ({ label, value, strong }) => (
  <div className={strong ? "flex items-center justify-between border-t pt-2.5" : "flex items-center justify-between"}>
    <span className={strong ? "text-sm font-semibold" : "text-sm text-muted-foreground"}>{label}</span>
    <span className={strong ? "text-base font-semibold tabular-nums" : "text-sm font-medium tabular-nums"}>{value}</span>
  </div>
);

const InvoiceViewComponent = () => {
  const { InvoiceID } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/getInvoiceByID/${InvoiceID}`);
        const invoice = response.data.success ? response.data.invoice : response.data;
        setInvoiceData(invoice);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [InvoiceID]);

  if (loading) {
    return <PageLoader label="Chargement des détails de la facture…" />;
  }

  if (!invoiceData) {
    return navigate(`/Dashboard/ListeFactures/`);
  }

  const isPaid = invoiceData.Status === "Paid";

  return (
    <>
      <PageHeader
        icon={FileText}
        title="Détails de la facture"
        description={`Facture N° ${invoiceData.invoiceNumber}`}
        actions={
          <>
            <Badge variant={isPaid ? "success" : "destructive"} dot>
              {invoiceData.Status}
            </Badge>
            <Button variant="outline" onClick={() => navigate("/Dashboard/ListeFactures")}>
              <ArrowLeft /> Retour
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-6">
        {/* ---------------- Infos ---------------- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="N° Facture" value={invoiceData.invoiceNumber} icon={Hash} />
          <InfoItem label="Client" value={invoiceData.customerName} icon={User} />
          <InfoItem label="Type de facture" value={invoiceData.InvoiceType} icon={FileText} />
          <InfoItem
            label="Date de facturation"
            value={new Date(invoiceData.InvoiceDate).toLocaleDateString("fr-CA")}
            icon={CalendarDays}
          />
          <InfoItem
            label="Date d'échéance"
            value={new Date(invoiceData.dueDate).toLocaleDateString("fr-CA")}
            icon={CalendarDays}
          />
        </div>

        {/* ---------------- Items ---------------- */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Détails des articles</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Quantité</TableHead>
                  <TableHead className="text-right">Prix unitaire</TableHead>
                  {invoiceData.DescriptionProduct === "Billetterie" && (
                    <>
                      <TableHead className="text-right">Achat</TableHead>
                      <TableHead className="text-right">Débourser</TableHead>
                    </>
                  )}
                  <TableHead className="text-right">TVA</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData.Items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.Description}</TableCell>
                    <TableCell className="text-center tabular-nums">{item.Quantity}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatAmount(item.Rate)}</TableCell>
                    {invoiceData.DescriptionProduct === "Billetterie" && (
                      <>
                        <TableCell className="text-right tabular-nums">{item.Montant_Achat}</TableCell>
                        <TableCell className="text-right tabular-nums">{item.Montant_Debourser}</TableCell>
                      </>
                    )}
                    <TableCell className="text-right tabular-nums">{item.Tax}%</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatAmount(item.Quantity * item.Rate * (1 + item.Tax / 100))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* ---------------- Totals + notes ---------------- */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Totaux</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5 pt-4">
              <TotalRow label="Total HT" value={`${formatAmount(invoiceData.TotalHT)} TND`} />
              <TotalRow label="Remise" value={`${formatAmount(invoiceData.Discount)} TND`} />
              <TotalRow label="TVA" value={`${formatAmount(invoiceData.Tva)} TND`} />
              <TotalRow label="Timbre fiscal" value={`${formatAmount(invoiceData.Timbre_Fiscal)} TND`} />
              <TotalRow
                label="Total TTC"
                value={`${formatAmount(invoiceData.TotalAmount)} TND`}
                strong
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex h-full flex-col justify-between gap-6 pt-6">
              {invoiceData.Items[0]?.Notes && (
                <div>
                  <h4 className="m-0 mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Notes</h4>
                  <p className="m-0 whitespace-pre-wrap text-sm leading-relaxed">{invoiceData.Items[0].Notes}</p>
                </div>
              )}
              <div className="flex items-center justify-end">
                <div className="rounded-xl border bg-card p-3 shadow-card">
                  <QRCode
                    value={`STE KAYAN VOYAGES Facture N°: ${invoiceData.invoiceNumber}, Total: ${Number(invoiceData.TotalAmount).toFixed(3)} TND`}
                    size={128}
                    level="H"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default InvoiceViewComponent;
