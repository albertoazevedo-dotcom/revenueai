"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Bot,
  BookOpen,
  ChevronRight,
  PieChart,
  AlertTriangle,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pipeline", label: "Pipeline", icon: PieChart },
  { href: "/perdas", label: "Perdas", icon: AlertTriangle },
  { href: "/crm", label: "CRM", icon: Users },
  { href: "/enablement", label: "Enablement", icon: ShieldCheck },
  { href: "/agentes-ia", label: "Agentes IA", icon: Bot },
];

const edu = [
  { href: "/revenue-academy", label: "Revenue Academy", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className="w-56 flex-shrink-0 flex flex-col h-full"
      style={{ background: "var(--bg-secondary)", borderRight: "1px solid var(--border-color)" }}
    >
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ background: "var(--accent-purple)" }}
        >
          R
        </div>
        <span className="text-white font-semibold text-base">RevenueAI</span>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group"
              style={{
                background: active ? "var(--accent-purple)" : "transparent",
                color: active ? "#fff" : "var(--text-secondary)",
              }}
            >
              <Icon size={16} strokeWidth={2} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      {/* Education */}
      <div className="px-3 pb-4">
        <p className="text-xs font-medium uppercase tracking-widest px-3 pb-1.5" style={{ color: "var(--text-muted)" }}>
          Educação
        </p>
        {edu.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
              style={{
                background: active ? "var(--accent-purple)" : "transparent",
                color: active ? "#fff" : "var(--text-secondary)",
              }}
            >
              <Icon size={16} strokeWidth={2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
