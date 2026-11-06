/* eslint-disable react/prop-types */
import kvLogo from "./KVLogo.png";
import { cn } from "@/lib/utils";

/** Kayan Voyage brand mark + wordmark. `collapsed` shows only the mark. */
const Logo = ({ collapsed = false, className }) => (
  <div className={cn("flex items-center gap-3", className)}>
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-md ring-1 ring-white/10">
      <img src={kvLogo} alt="Kayan Voyage" className="h-full w-full object-contain" />
    </div>
    {!collapsed && (
      <div className="min-w-0 leading-tight">
        <p className="m-0 truncate text-[15px] font-semibold tracking-tight text-white">Kayan Voyage</p>
        <p className="m-0 truncate text-[11px] font-medium uppercase tracking-[0.14em] text-accent">Facturation</p>
      </div>
    )}
  </div>
);

export default Logo;
