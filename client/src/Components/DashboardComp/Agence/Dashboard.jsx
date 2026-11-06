import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Building2,
  ChartColumn,
  ChartPie,
  Clock,
  Landmark,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import axiosInstance from "../../../Auth/AxiosInstance";
import { PageHeader } from "@/Components/ui/page-header";
import { StatCard } from "@/Components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { PageLoader } from "@/Components/ui/spinner";
import { EmptyState } from "@/Components/ui/empty-state";
import { formatAmount } from "@/lib/format";

// Brand palette (matches the app tokens in App.css)
const palette = {
  teal: "#1E8FA9",
  sand: "#F6D209",
  green: "#30A66F",
  violet: "#855CCC",
  coral: "#EB6847",
};

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
  color: "hsl(var(--foreground))",
  fontSize: "13px",
};

const legendStyle = { fontSize: "13px", color: "#64748b" };

const dt = (v) => `${formatAmount(v)} TND`;

/**
 * Real agency overview — all figures are computed from the invoices API.
 * `previewData` (dev/preview hook) skips the fetch and renders the given rows.
 */
const Agence = ({ previewData = null }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(previewData || []);
  const [loading, setLoading] = useState(!previewData);

  useEffect(() => {
    if (previewData) return undefined;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/v1/getInvoices");
        const invoices = response.data.success ? response.data.invoices : response.data;
        const formattedInvoices = invoices.map((invoice) => ({
          ...invoice,
          dueDate: new Date(invoice.dueDate).toISOString().split("T")[0],
          InvoiceDate: new Date(invoice.InvoiceDate).toISOString().split("T")[0],
        }));
        setData(formattedInvoices);
      } catch (error) {
        console.error("Error fetching data from server:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return undefined;
  }, [previewData]);

  const totals = useMemo(() => {
    const today = new Date();
    let total = 0;
    let paid = 0;
    let pending = 0;
    let unpaid = 0;
    let overdue = 0;
    let avoirs = 0;

    data.forEach((inv) => {
      const amount = Number(inv.TotalAmount) || 0;
      total += amount;
      if (inv.Status === "Paid") paid += amount;
      else if (inv.Status === "Pending") pending += amount;
      else if (inv.Status === "Unpaid") unpaid += amount;
      if (inv.Status !== "Paid" && inv.dueDate && new Date(inv.dueDate) < today) overdue += amount;
      if (inv.InvoiceType === "Avoir") avoirs += 1;
    });

    return {
      total,
      paid,
      pending,
      unpaid,
      overdue,
      avoirs,
      count: data.length,
      avg: data.length ? total / data.length : 0,
    };
  }, [data]);

  // Revenue per month over the last 12 months
  const monthlyData = useMemo(() => {
    const map = new Map();
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map.set(key, { key, label: d.toLocaleDateString("fr-FR", { month: "short" }), total: 0 });
    }
    data.forEach((inv) => {
      const key = String(inv.InvoiceDate || "").slice(0, 7);
      const entry = map.get(key);
      if (entry) entry.total += Number(inv.TotalAmount) || 0;
    });
    return [...map.values()];
  }, [data]);

  // Paid / unpaid split
  const statusData = useMemo(
    () =>
      [
        { name: "Payées", value: totals.paid, color: palette.green },
        { name: "Partiellement payées", value: totals.pending, color: palette.sand },
        { name: "Impayées", value: totals.unpaid, color: palette.coral },
      ].filter((s) => s.value > 0),
    [totals]
  );

  // Product-type split
  const productData = useMemo(() => {
    const map = new Map();
    data.forEach((inv) => {
      const key = inv.DescriptionProduct || "Autre";
      map.set(key, (map.get(key) || 0) + (Number(inv.TotalAmount) || 0));
    });
    const colors = [palette.teal, palette.sand, palette.violet, palette.coral, palette.green];
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));
  }, [data]);

  // Top 5 clients by billed amount
  const topClients = useMemo(() => {
    const map = new Map();
    data.forEach((inv) => {
      const name = inv.customerName || "—";
      map.set(name, (map.get(name) || 0) + (Number(inv.TotalAmount) || 0));
    });
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [data]);

  const maxClient = topClients[0]?.value || 1;

  if (loading) {
    return <PageLoader label="Chargement des statistiques de l'agence…" />;
  }

  if (!data.length) {
    return (
      <>
        <PageHeader
          icon={Building2}
          title="Agence"
          description="Vue d'ensemble réelle de votre facturation."
        />
        <Card>
          <EmptyState
            icon={Receipt}
            title="Aucune facture pour le moment"
            description="Créez votre première facture pour voir les statistiques de l'agence apparaître ici."
            action={
              <Button onClick={() => navigate("/Dashboard/DashboardBi")}>
                <Receipt /> Créer une facture
              </Button>
            }
          />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        icon={Building2}
        title="Agence"
        description="Vue d'ensemble réelle de votre facturation — calculée à partir de vos factures."
      />

      {/* ---------------- KPI ---------------- */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Total facturé"
          value={dt(totals.total)}
          icon={Receipt}
          tone="primary"
          hint={`${totals.count} facture(s) dont ${totals.avoirs} avoir(s)`}
        />
        <StatCard
          label="Encaissé"
          value={dt(totals.paid)}
          icon={Wallet}
          tone="success"
          hint={totals.total ? `${((totals.paid / totals.total) * 100).toFixed(1)} % du total` : undefined}
        />
        <StatCard
          label="En attente"
          value={dt(totals.pending)}
          icon={Clock}
          tone="warning"
          hint="Factures partiellement payées"
        />
        <StatCard
          label="En retard"
          value={dt(totals.overdue)}
          icon={Landmark}
          tone="destructive"
          hint="Échéance dépassée, non payées"
        />
        <StatCard
          label="Panier moyen"
          value={dt(totals.avg)}
          icon={TrendingUp}
          tone="violet"
          hint="Par facture émise"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ---------------- Revenue trend ---------------- */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center gap-2.5 border-b pb-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ChartColumn className="h-4 w-4" />
            </div>
            <CardTitle>Revenus des 12 derniers mois</CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="revTeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={palette.teal} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={palette.teal} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.25} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} tickMargin={6} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => dt(value)} />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Revenus"
                  stroke={palette.teal}
                  strokeWidth={2.5}
                  fill="url(#revTeal)"
                  dot={{ r: 3, fill: palette.teal, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ---------------- Status split ---------------- */}
        <Card>
          <CardHeader className="flex-row items-center gap-2.5 border-b pb-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ChartPie className="h-4 w-4" />
            </div>
            <CardTitle>Répartition par statut</CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="88%" paddingAngle={3} strokeWidth={0}>
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => dt(value)} />
                <Legend wrapperStyle={legendStyle} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ---------------- Product split ---------------- */}
        <Card>
          <CardHeader className="flex-row items-center gap-2.5 border-b pb-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ChartPie className="h-4 w-4" />
            </div>
            <CardTitle>Répartition par produit</CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={productData} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="88%" paddingAngle={3} strokeWidth={0}>
                  {productData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => dt(value)} />
                <Legend wrapperStyle={legendStyle} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ---------------- Top clients ---------------- */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center gap-2.5 border-b pb-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
            <CardTitle>Top 5 clients</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-5">
            {topClients.map((client, index) => (
              <div key={client.name}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span className="truncate text-sm font-medium">{client.name}</span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">{dt(client.value)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                    style={{ width: `${Math.max(4, (client.value / maxClient) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Agence;
