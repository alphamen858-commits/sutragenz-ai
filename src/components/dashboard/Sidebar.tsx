"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { FEATURES } from "@/data/features";
import { cn } from "@/lib/utils";

const topLinks = [{ href: "/dashboard", label: "Home", icon: Home }];
const bottomLinks = [{ href: "/dashboard/settings", label: "Settings", icon: Settings }];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-white/5 bg-space-800/60 px-3 py-6 lg:flex">
      <Link href="/dashboard" className="mb-8 px-3">
        <Logo />
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {topLinks.map((l) => (
          <SidebarLink key={l.href} {...l} active={pathname === l.href} />
        ))}

        <p className="px-3 pb-1 pt-4 text-[11px] uppercase tracking-widest text-white/25">
          AI Tools
        </p>
        {FEATURES.map((f) => (
          <SidebarLink
            key={f.key}
            href={f.href}
            label={f.name}
            icon={f.icon}
            active={pathname?.startsWith(f.href)}
          />
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/5 pt-3">
        {bottomLinks.map((l) => (
          <SidebarLink key={l.href} {...l} active={pathname === l.href} />
        ))}
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        active ? "bg-white/8 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}
