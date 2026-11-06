/* eslint-disable react/prop-types */
import CountUp from "react-countup";
import { Plane, ShieldCheck, Sparkles } from "lucide-react";
import kvLogo from "../assets/KVLogo.png";

const STATS = [
  { end: 574000, label: "Factures traitées" },
  { end: 335, suffix: "+", label: "Clients satisfaits" },
  { end: 239000, suffix: "M", label: "Transactions" },
];

/** Split-screen layout shared by Login / Signup / Reset password. */
export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-brand-950 p-12 text-white lg:flex xl:p-16">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-500/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -right-24 h-[460px] w-[460px] rounded-full bg-accent/20 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
        <Plane className="pointer-events-none absolute right-16 top-24 h-24 w-24 -rotate-12 text-white/[0.06]" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-1.5 shadow-lg">
            <img src={kvLogo} alt="Kayan Voyage" className="h-full w-full object-contain" />
          </div>
          <div className="leading-tight">
            <p className="m-0 text-lg font-semibold">Kayan Voyage</p>
            <p className="m-0 text-xs font-medium uppercase tracking-[0.16em] text-accent">La vraie aventure</p>
          </div>
        </div>

        <div className="relative max-w-lg">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-brand-100 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Plateforme de facturation
          </span>
          <h2 className="m-0 mt-5 text-4xl font-semibold leading-[1.15] tracking-tight xl:text-[44px]">
            Vos factures de voyage,{" "}
            <span className="bg-gradient-to-r from-brand-200 to-accent bg-clip-text text-transparent">simples et rapides.</span>
          </h2>
          <p className="m-0 mt-4 text-[15px] leading-relaxed text-brand-100/80">
            GSoft Innovations vous offre une solution complète pour la gestion de vos facturations. Simplifiez votre
            processus de facturation avec notre application innovante.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                <CountUp
                  end={s.end}
                  suffix={s.suffix}
                  duration={2.5}
                  separator=" "
                  className="block text-2xl font-semibold tabular-nums tracking-tight"
                />
                <span className="mt-1 block text-xs text-brand-100/70">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-between text-xs text-brand-100/60">
          <span>© {new Date().getFullYear()} GSoft Innovations. Tous droits réservés.</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> Connexion sécurisée
          </span>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col items-center justify-center px-6 py-12 sm:px-10">
        <div className="mb-10 flex items-center gap-3 lg:hidden">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border bg-white p-1.5 shadow-sm">
            <img src={kvLogo} alt="Kayan Voyage" className="h-full w-full object-contain" />
          </div>
          <div className="leading-tight">
            <p className="m-0 font-semibold">Kayan Voyage</p>
            <p className="m-0 text-xs font-medium uppercase tracking-[0.14em] text-primary">Facturation</p>
          </div>
        </div>
        <div className="w-full max-w-[400px] animate-fade-up">{children}</div>
        <p className="m-0 mt-10 text-xs text-muted-foreground lg:hidden">
          © {new Date().getFullYear()} GSoft Innovations
        </p>
      </main>
    </div>
  );
}
