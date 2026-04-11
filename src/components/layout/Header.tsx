"use client";
import { Bell, Video, ChevronDown } from "lucide-react";

export function Header() {
  return (
    <header
      className="h-14 flex items-center justify-between px-6 flex-shrink-0"
      style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}
    >
      {/* Org selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Organização:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          <span className="text-sm font-medium text-white">TechSolutions S.A.</span>
          <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Nova Reunião */}
        <button
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--accent-purple)" }}
        >
          <Video size={15} strokeWidth={2} />
          Nova Reunião
        </button>

        {/* Bell */}
        <button className="relative p-1.5 rounded-lg" style={{ color: "var(--text-secondary)" }}>
          <Bell size={18} strokeWidth={2} />
          <span
            className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center text-[9px] font-bold"
            style={{ background: "var(--color-red)" }}
          >
            3
          </span>
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ background: "var(--accent-purple)" }}
        >
          AS
        </div>
      </div>
    </header>
  );
}
