export function PointOfView() {
  return (
    <section id="why" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet/70">
            The Sutragenz point of view
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Less tab-hopping.
            <br />
            More <span className="text-gradient">becoming</span>.
          </h2>
        </div>
        <p className="self-end text-white/55">
          The best tools don&apos;t steal your voice. They clear the static so
          you can hear it more clearly.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card-surface rounded-2xl p-8">
          <h3 className="font-display text-lg font-medium text-white">
            Create without context switching
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            One workspace for the jump from a first thought to something
            people can use.
          </p>
        </div>
        <div className="card-surface rounded-2xl p-8">
          <h3 className="font-display text-lg font-medium text-white">
            A point of view, not just output
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Sutragenz helps you make better calls, not simply make more
            things.
          </p>
        </div>
      </div>
    </section>
  );
}
