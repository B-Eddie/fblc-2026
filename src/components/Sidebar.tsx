"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  LayoutDashboard,
  Store,
  Users,
  Zap,
  Map,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/businesses", label: "Businesses", icon: Store },
  { href: "/dashboard/agents", label: "Agents", icon: Users },
  { href: "/dashboard/simulations", label: "Simulations", icon: Zap },
  { href: "/dashboard/map", label: "Map", icon: Map },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen border-r border-white/10 bg-black flex flex-col transition-all duration-300 z-40 font-mono",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <BarChart3 className="w-5 h-5 text-white shrink-0" />
          {!collapsed && (
            <span className="text-sm text-white font-mono whitespace-nowrap">
              Marketify
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-xs font-mono transition-all",
                isActive
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent",
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Stats */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/30">Agents</span>
            <span className="text-white/60">20</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/30">Businesses</span>
            <span className="text-white/60">3</span>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="m-2 p-2 text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors flex items-center justify-center border border-transparent hover:border-white/10"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}
