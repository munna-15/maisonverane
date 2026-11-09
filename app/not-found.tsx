import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-warm px-6 text-center text-ink">
      <p className="text-xs tracking-[0.3em] text-wine">MAISON VÉRANE</p>

      <h1 className="mt-6 font-serif text-8xl font-light text-burgundy">404</h1>

      <h2 className="mt-5 font-serif text-3xl font-light">
        This page could not be found.
      </h2>

      <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/70">
        The page you are looking for may have moved or no longer exists.
      </p>

      <Link
        href="/"
        className="mt-9 border border-burgundy bg-burgundy px-8 py-3 text-xs tracking-[0.18em] text-warm transition-colors duration-300 hover:bg-wine"
      >
        RETURN HOME
      </Link>
    </section>
  );
}
