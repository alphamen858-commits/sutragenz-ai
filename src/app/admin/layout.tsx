import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-space-900">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <Logo />
        <nav className="flex gap-6 text-sm text-white/60">
          <Link href="/admin" className="hover:text-white">Overview</Link>
          <Link href="/admin/users" className="hover:text-white">Users</Link>
          <Link href="/admin/payments" className="hover:text-white">Payments</Link>
          <Link href="/admin/usage" className="hover:text-white">AI Usage</Link>
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
