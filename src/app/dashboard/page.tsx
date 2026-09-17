import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { FEATURES } from "@/data/features";
import { Sparkles, Flame, MessageSquare, FolderKanban } from "lucide-react";

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [chatCount, projectCount] = userId
    ? await Promise.all([
        prisma.chat.count({ where: { userId } }),
        prisma.project.count({ where: { userId } }),
      ])
    : [0, 0];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-semibold text-white">
        Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}.
      </h1>
      <p className="mt-1 text-sm text-white/50">Where do you want to move today?</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatsCard icon={Sparkles} label="XP" value={session?.user?.xp ?? 0} accent="cyan" />
        <StatsCard icon={Flame} label="Day streak" value={session?.user?.streak ?? 0} accent="electric" />
        <StatsCard icon={MessageSquare} label="Conversations" value={chatCount} accent="violet" />
        <StatsCard icon={FolderKanban} label="Projects" value={projectCount} accent="cyan" />
      </div>

      <h2 className="mt-10 font-display text-lg font-medium text-white">Jump back in</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.slice(0, 6).map((f) => {
          const Icon = f.icon;
          return (
            <a
              key={f.key}
              href={f.href}
              className="card-surface flex items-center gap-3 rounded-xl p-4 transition-transform hover:-translate-y-0.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-cyan">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <div className="text-sm font-medium text-white">{f.name}</div>
                <div className="text-xs text-white/45">{f.tagline}</div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
