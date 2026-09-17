"use client";

import { useSession } from "next-auth/react";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-white">
        <SettingsIcon className="h-5 w-5 text-white/60" /> Settings
      </h1>

      <div className="card-surface mt-6 rounded-2xl p-6">
        <h2 className="text-sm font-medium text-white/70">Account</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-white/40">Name</p>
            <p className="mt-1 text-sm text-white">{session?.user?.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-white/40">Email</p>
            <p className="mt-1 text-sm text-white">{session?.user?.email ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-white/40">Plan</p>
            <p className="mt-1 text-sm text-white">{session?.user?.plan ?? "FREE"}</p>
          </div>
          <div>
            <p className="text-xs text-white/40">Role</p>
            <p className="mt-1 text-sm text-white">{session?.user?.role ?? "USER"}</p>
          </div>
        </div>
      </div>

      <div className="card-surface mt-4 rounded-2xl p-6">
        <h2 className="text-sm font-medium text-white/70">Billing</h2>
        <p className="mt-2 text-sm text-white/50">
          Manage your subscription and payment method. Wire this section to
          Stripe's customer portal or Razorpay's subscription dashboard.
        </p>
      </div>
    </div>
  );
}
