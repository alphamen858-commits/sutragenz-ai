import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Logo />
        <p className="text-xs tracking-[0.15em] text-white/35">SEE · THINK · CREATE</p>
        <div className="flex gap-6 text-sm text-white/50">
          <a href="#tools" className="hover:text-white">Tools</a>
          <a href="#constellation" className="hover:text-white">Constellation</a>
          <a href="/sign-up" className="hover:text-white">Start here</a>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-white/25">
        © {new Date().getFullYear()} Sutragenz.ai — Created by N. Varun Sandeep
      </p>
    </footer>
  );
}
