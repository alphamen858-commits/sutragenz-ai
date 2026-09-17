"use client";

import { useSession, signOut } from "next-auth/react";
import { Flame, Sparkles, LogOut } from "lucide-react";

export function Topbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-space-900/60 px-6 backdrop-blur-lg">
      <div />
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5 text-sm text-white/60">
          <Sparkles className="h-4 w-4 text-cyan" />
          {user?.xp ?? 0} XP
        </div>
        <div className="flex items-center gap-1.5 text-sm text-white/60">
          <Flame className="h-4 w-4 text-orange-400" />
          {user?.streak ?? 0} day streak
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/50">
          {user?.plan ?? "FREE"}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-violet text-xs font-semibold text-space-900">
          {user?.name?.[0]?.toUpperCase() ?? "S"}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-white/40 transition-colors hover:text-white"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
