import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="container-editorial">
      <div className="mx-auto flex min-h-[60dvh] max-w-xl flex-col items-center justify-center py-20 text-center sm:py-28">
        <p className="eyebrow">Your Bag</p>

        <h1 className="mt-5 text-[clamp(2.25rem,1.6rem+2.4vw,3.5rem)] font-light leading-[1.05] text-burgundy">
          Your bag is currently{" "}
          <em className="font-normal italic text-wine">empty</em>
        </h1>

        <p className="mt-6 max-w-md text-base leading-[1.75] text-ink-muted">
          Pieces you add will wait for you here. Explore the collection and find
          something made to be worn and loved for years.
        </p>

        <Link
          href="/clothing"
          className="mt-10 inline-flex h-14 items-center justify-center bg-burgundy px-12 text-xs font-medium uppercase tracking-[0.2em] text-warm transition-colors duration-300 hover:bg-wine focus-visible:bg-wine"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
