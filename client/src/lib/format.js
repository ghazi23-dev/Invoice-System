const amountFmt = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

/** 1234.5 → "1 234,500" (empty string for null/blank/NaN). */
export const formatAmount = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const n = Number(value);
  return Number.isFinite(n) ? amountFmt.format(n) : String(value);
};

/** 1234.5 → "1 234,500 DT" */
export const formatDT = (value) => {
  const s = formatAmount(value ?? 0);
  return s ? `${s} DT` : "0,000 DT";
};

/** ISO date/time → "05/11/2026" */
export const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString("fr-FR");
};
