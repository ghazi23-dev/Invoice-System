/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Banknote } from "lucide-react";
import axiosInstance from "../../../Auth/AxiosInstance";
import { Modal } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { NativeSelect } from "@/Components/ui/native-select";
import { Field } from "@/Components/ui/field";

const modes = ["Espèces", "Chèque", "Virement", "Carte"];

const today = () => new Date().toISOString().split("T")[0];

/**
 * Record a payment (partial or full) against an invoice.
 * Pass `invoice` to preselect it (from the invoice list), or leave it null
 * to pick one from the open invoices dropdown.
 */
const PaymentForm = ({ isOpen, onClose, invoice = null, onSuccess }) => {
  const [loadingData, setLoadingData] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [settledSums, setSettledSums] = useState({});

  const [InvoiceID, setInvoiceID] = useState(invoice ? String(invoice.InvoiceID) : "");
  const [Montant, setMontant] = useState("");
  const [Mode, setMode] = useState("Espèces");
  const [DateReglement, setDateReglement] = useState(today());
  const [Reference, setReference] = useState("");
  const [Notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    let cancelled = false;

    const load = async () => {
      setLoadingData(true);
      try {
        const [invRes, regRes] = await Promise.all([
          axiosInstance.get("/api/v1/getInvoices"),
          axiosInstance.get("/api/v1/getReglements"),
        ]);
        if (cancelled) return;
        const inv = invRes.data.success ? invRes.data.invoices : invRes.data;
        const regs = regRes.data.success ? regRes.data.reglements : regRes.data || [];
        const sums = {};
        regs.forEach((r) => {
          sums[r.InvoiceID] = (sums[r.InvoiceID] || 0) + Number(r.Montant);
        });
        setInvoices(inv);
        setSettledSums(sums);
      } catch (error) {
        console.error("Error loading invoices:", error);
        toast.error("Impossible de charger les factures.");
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const options = useMemo(() => {
    const withReste = (i) => ({
      ...i,
      reste: Math.max(0, Number(i.TotalAmount) - (settledSums[i.InvoiceID] || 0)),
    });
    let list = invoices.filter((i) => i.InvoiceType !== "Avoir" && i.Status !== "Paid").map(withReste);
    // The preselected invoice is always offered, even if the lists are stale
    if (invoice && !list.some((i) => i.InvoiceID === invoice.InvoiceID)) {
      list = [withReste(invoice), ...list];
    }
    return list.filter((i) => i.reste > 0 || i.InvoiceID === Number(InvoiceID));
  }, [invoices, settledSums, invoice, InvoiceID]);

  const selected = options.find((i) => String(i.InvoiceID) === String(InvoiceID)) || null;

  const handleInvoiceChange = (event) => {
    const id = event.target.value;
    setInvoiceID(id);
    setErrors((e) => ({ ...e, invoice: undefined }));
    const chosen = options.find((i) => String(i.InvoiceID) === id);
    if (chosen) {
      setMontant(chosen.reste.toFixed(3)); // prefill with the outstanding balance
    }
  };

  const handleSubmit = async () => {
    const nextErrors = {};
    if (!InvoiceID) nextErrors.invoice = "Choisissez une facture";
    const amount = parseFloat(Montant);
    if (!Number.isFinite(amount) || amount <= 0) {
      nextErrors.montant = "Saisissez un montant valide";
    } else if (selected && amount > selected.reste + 0.001) {
      nextErrors.montant = `Le montant dépasse le reste à payer (${selected.reste.toFixed(3)} TND)`;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const response = await axiosInstance.post("/api/v1/addReglement", {
        InvoiceID: parseInt(InvoiceID),
        Montant: amount,
        Mode,
        DateReglement,
        Reference,
        Notes,
      });

      if (response.data.success) {
        const status = response.data.reglement?.Invoice?.Status;
        toast.success(
          status === "Paid"
            ? "Règlement enregistré — facture soldée !"
            : "Règlement enregistré avec succès"
        );
        setMontant("");
        setReference("");
        setNotes("");
        setInvoiceID("");
        onSuccess?.();
        onClose();
      } else {
        toast.error(response.data.message || "Erreur lors de l'enregistrement du règlement.");
      }
    } catch (error) {
      console.error("Error saving reglement:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement du règlement.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="sm"
      icon={Banknote}
      title="Nouveau règlement"
      description="Encaissez un paiement partiel ou total pour une facture."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} loading={submitting}>
            Enregistrer le règlement
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Facture" required error={errors.invoice} hint={loadingData ? "Chargement des factures…" : undefined}>
          <NativeSelect
            value={InvoiceID}
            onChange={handleInvoiceChange}
            placeholder="Choisir une facture ouverte"
            invalid={!!errors.invoice}
          >
            {options.map((i) => (
              <option key={i.InvoiceID} value={String(i.InvoiceID)}>
                {i.invoiceNumber} — {i.customerName}
              </option>
            ))}
          </NativeSelect>
        </Field>

        {selected && (
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3.5 py-2.5">
            <span className="text-xs text-muted-foreground">Reste à payer</span>
            <span className="text-sm font-semibold tabular-nums">
              {selected.reste.toFixed(3)} TND
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                sur {Number(selected.TotalAmount).toFixed(3)}
              </span>
            </span>
          </div>
        )}

        <Field label="Montant réglé (TND)" required error={errors.montant}>
          <Input
            type="number"
            min="0"
            step="0.001"
            value={Montant}
            onChange={(e) => {
              setMontant(e.target.value);
              setErrors((er) => ({ ...er, montant: undefined }));
            }}
            placeholder="0.000"
            invalid={!!errors.montant}
            className="text-right"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Mode de paiement" required>
            <NativeSelect value={Mode} onChange={(e) => setMode(e.target.value)}>
              {modes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Date du règlement" required>
            <Input type="date" value={DateReglement} onChange={(e) => setDateReglement(e.target.value)} />
          </Field>
        </div>

        <Field label="Référence" hint="N° de chèque, virement ou reçu (optionnel)">
          <Input value={Reference} onChange={(e) => setReference(e.target.value)} placeholder="Ex : CHQ 1245877" />
        </Field>

        <Field label="Notes">
          <Textarea
            value={Notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observation éventuelle…"
            className="min-h-[64px]"
          />
        </Field>
      </div>
    </Modal>
  );
};

export default PaymentForm;
