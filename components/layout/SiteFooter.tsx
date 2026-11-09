import Link from "next/link";

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */
interface FooterLink {
  readonly label: string;
  readonly href: string;
}

interface SocialLink {
  readonly label: string;
  /** Replace with the real profile URL */
  readonly href: string;
}

/* --------------------------------------------------------------------------
   Content: replace copy and links here
   Internal routes are placeholders until the pages exist.
   -------------------------------------------------------------------------- */
const BRAND = {
  name: "Maison Vérane",
  statement:
    "A considered approach to modern femininity. Thoughtfully selected pieces for the way you live.",
} as const;

const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "Pinterest", href: "https://www.pinterest.com/" },
];

const EXPLORE_LINKS: readonly FooterLink[] = [
  { label: "New In", href: "/new-in" },
  { label: "Clothing", href: "/clothing" },
  { label: "Dresses", href: "/dresses" },
  { label: "Collections", href: "/collections" },
  { label: "About Us", href: "/about" },
];

const CARE_LINKS: readonly FooterLink[] = [
  { label: "Contact Us", href: "/contact" },
  { label: "Shipping & Delivery", href: "/shipping" },
  { label: "Returns & Exchanges", href: "/returns" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "FAQs", href: "/faqs" },
];

const LEGAL_LINKS: readonly FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

const CONTACT = {
  email: "hello@maisonverane.com",
  location: "Dhaka, Bangladesh",
  note: "We would love to hear from you.",
} as const;

const COPYRIGHT_YEAR = 2026;

/* --------------------------------------------------------------------------
   Shared styles
   -------------------------------------------------------------------------- */
const headingClasses =
  "font-sans text-xs font-medium uppercase leading-none tracking-[0.22em] text-champagne";

const linkClasses =
  "inline-block py-1 text-[0.9375rem] leading-snug text-warm/80 transition-colors duration-300 hover:text-champagne focus-visible:text-champagne";

/* --------------------------------------------------------------------------
   Link column
   -------------------------------------------------------------------------- */
interface FooterLinkColumnProps {
  id: string;
  title: string;
  links: readonly FooterLink[];
}

function FooterLinkColumn({ id, title, links }: FooterLinkColumnProps) {
  return (
    <nav aria-labelledby={id}>
      <h2 id={id} className={headingClasses}>
        {title}
      </h2>
      <ul className="mt-5 flex flex-col gap-1.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClasses}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* --------------------------------------------------------------------------
   Footer
   -------------------------------------------------------------------------- */
export function SiteFooter() {
  return (
    <footer className="on-dark border-t border-champagne/25 bg-burgundy text-warm">
      <div className="container-editorial pb-8 pt-16 sm:pt-20 lg:pt-24">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-10 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-x-12 xl:gap-x-20">
          {/* Column 1: brand identity */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label={`${BRAND.name}, home`}
              className="inline-block whitespace-nowrap font-serif text-[clamp(2.25rem,1.6rem+2.4vw,3.25rem)] font-light leading-none tracking-[0.02em] text-warm transition-colors duration-300 hover:text-champagne focus-visible:text-champagne"
            >
              {BRAND.name}
            </Link>

            <p className="mt-6 max-w-xs text-[0.9375rem] leading-[1.75] text-warm/80">
              {BRAND.statement}
            </p>

            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${BRAND.name} on ${social.label} (opens in a new tab)`}
                    className="inline-block py-1 text-xs font-medium uppercase tracking-[0.2em] text-warm/80 transition-colors duration-300 hover:text-champagne focus-visible:text-champagne"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: explore */}
          <FooterLinkColumn
            id="footer-explore"
            title="Explore"
            links={EXPLORE_LINKS}
          />

          {/* Column 3: customer care */}
          <FooterLinkColumn
            id="footer-care"
            title="Customer Care"
            links={CARE_LINKS}
          />

          {/* Column 4: get in touch */}
          <div className="col-span-2 lg:col-span-1">
            <h2 className={headingClasses}>Get in Touch</h2>

            <address className="mt-5 flex flex-col items-start gap-1.5 not-italic">
              <a
                href={`mailto:${CONTACT.email}`}
                className={`${linkClasses} break-words`}
              >
                {CONTACT.email}
              </a>
              <p className="py-1 text-[0.9375rem] leading-snug text-warm/80">
                {CONTACT.location}
              </p>
            </address>

            <p className="mt-6 font-serif text-lg italic leading-snug text-champagne">
              {CONTACT.note}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-warm/15 pt-6 lg:mt-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:items-center sm:gap-4">
            {/* Copyright - Left */}
            <p className="text-center text-[0.8125rem] leading-snug text-warm/65 sm:text-left">
              © {COPYRIGHT_YEAR} {BRAND.name}. All rights reserved.
            </p>

            {/* Developer details - Center */}
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-xs tracking-[0.08em] text-warm/60">
                Developed by{" "}
                <span className="font-medium text-champagne">Munna</span>
              </p>

              <a
                href="tel:+8801792960610"
                className="text-xs text-warm/60 transition-colors duration-300 hover:text-champagne"
              >
                01792960610
              </a>

              <a
                href="mailto:mustafijurrahman0610@gmail.com"
                className="break-all text-xs text-warm/60 transition-colors duration-300 hover:text-champagne"
              >
                mustafijurrahman0610@gmail.com
              </a>
            </div>

            {/* Legal links - Right */}
            <nav aria-label="Legal" className="sm:justify-self-end">
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1 sm:justify-end">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block py-1 text-[0.8125rem] leading-snug text-warm/65 transition-colors duration-300 hover:text-champagne focus-visible:text-champagne"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
