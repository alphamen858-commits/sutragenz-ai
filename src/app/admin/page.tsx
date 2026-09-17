import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, CreditCard, MessageSquare, TrendingUp } from "lucide-react";

export default async function AdminOverview() {
  const [userCount, subCount, chatCount, proCount] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({ where: { active: true } }),
    prisma.chat.count(),
    prisma.user.count({ where: { plan: "PRO" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-semibold text-white">Admin overview</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatsCard icon={Users} label="Total users" value={userCount} />
        <StatsCard icon={CreditCard} label="Active subscriptions" value={subCount} accent="electric" />
        <StatsCard icon={MessageSquare} label="Total chats" value={chatCount} accent="violet" />
        <StatsCard icon={TrendingUp} label="Pro users" value={proCount} accent="cyan" />
      </div>
    </div>
  );
}
