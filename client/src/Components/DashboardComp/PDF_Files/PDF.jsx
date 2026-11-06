import { useState, useEffect } from "react";
import { CalendarDays, Download, FileText, Search } from "lucide-react";
import axiosInstance from "../../../Auth/AxiosInstance";
import { PageHeader } from "@/Components/ui/page-header";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { EmptyState } from "@/Components/ui/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { cn } from "@/lib/utils";

const monthOptions = [
  { value: "01", label: "Janvier" },
  { value: "02", label: "Février" },
  { value: "03", label: "Mars" },
  { value: "04", label: "Avril" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Juin" },
  { value: "07", label: "Juillet" },
  { value: "08", label: "Août" },
  { value: "09", label: "Septembre" },
  { value: "10", label: "Octobre" },
  { value: "11", label: "Novembre" },
  { value: "12", label: "Décembre" },
];

const subjectOptions = [
  { value: "invoice", label: "Facture" },
  { value: "report", label: "Rapport" },
  { value: "contract", label: "Contrat" },
];

const subjectLabel = (value) => subjectOptions.find((o) => o.value === value)?.label || value;

const PdfResource = () => {
  const [pdfItems, setPdfItems] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch the list of PDFs from the backend
    axiosInstance
      .get("/api/v1/listPdfs")
      .then((response) => {
        if (response.data.success) {
          setPdfItems(response.data.pdfs);
        }
      })
      .catch((err) => console.error("Error fetching PDFs:", err));
  }, []);

  const isDateInMonth = (dateString, monthValue) => {
    if (!monthValue || !dateString) return true;
    try {
      // Extract month from the date string (format: "2024-10-27")
      const dateMonth = dateString.split("-")[1];
      return dateMonth === monthValue;
    } catch (error) {
      console.error("Error parsing date:", error);
      return false;
    }
  };

  const filteredPdfItems = pdfItems.filter(
    (item) =>
      (selectedMonth === "" || isDateInMonth(item.date, selectedMonth)) &&
      (selectedSubject === "" || item.subject === selectedSubject) &&
      (searchTerm === "" ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await axiosInstance.get(`${fileUrl}`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <>
      <PageHeader
        icon={FileText}
        title="Archives PDF"
        description="Consultez et téléchargez vos documents archivés."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        {/* ---------------- Document list ---------------- */}
        <Card className="flex max-h-[calc(100vh-13rem)] flex-col overflow-hidden">
          <CardHeader className="gap-3 border-b">
            <CardTitle>Documents</CardTitle>
            <Input
              icon={Search}
              placeholder="Rechercher un document…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
            />
            <div className="grid grid-cols-2 gap-2">
              <Select value={selectedMonth || "all"} onValueChange={(v) => setSelectedMonth(v === "all" ? "" : v)}>
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue placeholder="Tous les mois" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les mois</SelectItem>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSubject || "all"} onValueChange={(v) => setSelectedSubject(v === "all" ? "" : v)}>
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {subjectOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="nice-scroll flex-1 overflow-y-auto">
            {filteredPdfItems.length ? (
              <div className="flex flex-col gap-2.5 py-1">
                {filteredPdfItems.map((item, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setSelectedPdf(item)}
                    className={cn(
                      "flex w-full flex-col gap-2 rounded-xl border bg-card p-3.5 text-left transition-all hover:border-primary/40 hover:shadow-card",
                      selectedPdf === item && "border-primary/60 ring-2 ring-primary/20"
                    )}
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="m-0 truncate text-sm font-semibold">{item.title}</p>
                          <p className="m-0 truncate text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <span
                        role="button"
                        tabIndex={0}
                        title="Télécharger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(item.fileUrl, item.title);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.stopPropagation();
                            handleDownload(item.fileUrl, item.title);
                          }
                        }}
                        className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-primary"
                      >
                        <Download className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between gap-2">
                      <Badge variant="secondary">{subjectLabel(item.subject)}</Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(item.date)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title="Aucun document"
                description="Aucun PDF ne correspond à votre recherche."
                className="py-10"
              />
            )}
          </CardContent>
        </Card>

        {/* ---------------- Preview pane ---------------- */}
        <Card className="flex max-h-[calc(100vh-13rem)] flex-col overflow-hidden">
          {selectedPdf ? (
            <>
              <CardHeader className="flex-row items-center justify-between gap-3 border-b">
                <div className="min-w-0">
                  <CardTitle className="truncate">{selectedPdf.title}</CardTitle>
                  <p className="m-0 mt-0.5 truncate text-sm text-muted-foreground">{selectedPdf.description}</p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(selectedPdf.date)}
                </Badge>
              </CardHeader>
              <CardContent className="min-h-0 flex-1 pt-4">
                <iframe
                  src={`${import.meta.env.VITE_BASE_API_URL}${selectedPdf.fileUrl}`}
                  className="h-full min-h-[420px] w-full rounded-lg border bg-muted/30"
                  title="PDF Preview"
                />
              </CardContent>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState
                icon={FileText}
                title="Sélectionnez un document"
                description="Choisissez un PDF dans la liste pour l'afficher ici."
              />
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default PdfResource;
