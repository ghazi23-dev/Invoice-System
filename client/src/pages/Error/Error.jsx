import { useNavigate } from "react-router-dom";
import { ArrowLeft, Compass, Home } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-lg shadow-brand-500/30">
          <Compass className="h-10 w-10" />
        </div>
      </div>
      <p className="m-0 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Erreur 404</p>
      <h1 className="m-0 mt-2 text-3xl font-semibold tracking-tight">Destination introuvable</h1>
      <p className="m-0 mt-3 max-w-md text-muted-foreground">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft /> Retour
        </Button>
        <Button onClick={() => navigate("/Dashboard/Home")}>
          <Home /> Tableau de bord
        </Button>
      </div>
    </div>
  );
}
