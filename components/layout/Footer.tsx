"use client"
// Sample comment
import Link from "next/link"
import { Mail, Phone, MapPin, MessageCircle, Clock, ArrowUpRight } from "lucide-react"

export default function Footer() {
  return (
    <footer className="footer-root">
      {/* ── Get In Touch ── */}
      <div className="cta-band">
        <div className="cta-inner">
          <div className="cta-grain" />
          <span className="cta-eyebrow">Let's Talk</span>
          <h2 className="cta-heading">
            GET IN <em>TOUCH</em>
          </h2>
          <p className="cta-sub">
            We would love to hear from you. Reach out for product inquiries,
            partnership opportunities, or mentorship enrollment.
          </p>
          <Link href="/contact" className="cta-btn">
            CONTACT US <ArrowUpRight className="cta-icon" />
          </Link>
        </div>
      </div>

      {/* ── Dark Footer ── */}
      <div className="dark-footer">
        {/* Subtle top rule */}
        <div className="footer-top-rule" />

        <div className="footer-grid-wrap">
          {/* ── Brand ── */}
          <div className="col-brand">
            <div className="brand-logo">
              <span className="brand-initial">P</span>
            </div>
            <div className="brand-text">
              <span className="brand-name">Penta Peaks</span>
              <span className="brand-tagline">International</span>
            </div>

            <p className="brand-desc">
              Pakistan&apos;s Gateway to Global Markets. Premium agricultural
              commodities, import/export mentorship, and company registration
              services.
            </p>

            <div className="social-row">
              <a
                href="https://www.facebook.com/people/PentaPeaks-International/61589825756983/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill"
                aria-label="Facebook"
              >
                <svg className="social-svg" fill="currentColor" viewBox="0 0 24 24" style={{ width: 14, height: 14 }}>
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/pentapeaks_intl"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill"
                aria-label="Instagram"
              >
                <svg className="social-svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ width: 14, height: 14 }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@pentapeaks_intl"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill"
                aria-label="TikTok"
              >
                <svg className="social-svg" fill="currentColor" viewBox="0 0 24 24" style={{ width: 14, height: 14 }}>
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.21-.42-.45-.61-.7-.02 3.68-.03 7.36-.04 11.04-.014 1.147-.282 2.278-.784 3.312a7.38 7.38 0 0 1-4.896 4.195c-1.394.314-2.845.228-4.188-.25a7.386 7.386 0 0 1-4.322-5.466 7.427 7.427 0 0 1 1.76-6.435 7.433 7.433 0 0 1 5.378-2.617c.08 1.61-.41 3.25-1.51 4.47-.96 1.07-2.42 1.63-3.85 1.48-1.012-.104-1.936-.617-2.584-1.434a4.42 4.42 0 0 1-.954-2.903c.03-1.07.49-2.12 1.28-2.87.97-.93 2.37-1.33 3.69-1.07 1.082.215 2.036.84 2.685 1.76.01-3.61.01-7.21.02-10.82Z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/pentapeaks-international-pvt-ltd/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill"
                aria-label="LinkedIn"
              >
                <svg className="social-svg" fill="currentColor" viewBox="0 0 24 24" style={{ width: 14, height: 14 }}>
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/923086222283"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill"
                aria-label="WhatsApp"
              >
                <MessageCircle className="social-svg" />
              </a>
            </div>
          </div>

          {/* ── Products ── */}
          <div className="col-links">
            <h4 className="col-head">Products</h4>
            <ul className="link-list">
              {[
                { label: "Rice", slug: "rice" },
                { label: "Fresh Fruits and Vegetables", slug: "fresh-fruits-and-vegetables" },
                { label: "Meat & Poultry", slug: "meat" },
                { label: "Grains & Corn", slug: "grains" },
                { label: "Animal Feed", slug: "animal-feed" },
                { label: "Spices & Seeds", slug: "seeds" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={`/products/${item.slug}`}
                    className="footer-link"
                  >
                    <span className="link-dot" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Quick Links ── */}
          <div className="col-links">
            <h4 className="col-head">Quick Links</h4>
            <ul className="link-list">
              {[
                { href: "/services", label: "Our Services" },
                { href: "/mentorship", label: "Mentorship Program" },
                { href: "/supplier", label: "Become a Supplier" },
                { href: "/buyer", label: "Buyer Inquiry" },
                { href: "/blog", label: "Blog" },
                { href: "/about", label: "About Us" },
                { href: "/student/login", label: "Student Portal" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">
                    <span className="link-dot" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact (Pakistan) ── */}
          <div className="col-contact">
            <h4 className="col-head">Pakistan Office</h4>
            <ul className="contact-list">
              <li className="contact-item">
                <span className="contact-icon-wrap">
                  <MapPin className="contact-icon" />
                </span>
                <a href="https://www.google.com/maps/place/WAPDA+Town+Lahore,+Pakistan/@31.427302,74.261013,14.6z/data=!4m6!3m5!1s0x391901080b110569:0x33b0fb0b941e5adf!8m2!3d31.4311985!4d74.2643582!16zL20vMGNzM2h2?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="contact-link">
                  WAPDA Town Lahore,<br />Pakistan
                </a>
              </li>
              <li className="contact-item">
                <span className="contact-icon-wrap">
                  <Phone className="contact-icon" />
                </span>
                <a href="tel:+923086222283" className="contact-link">
                  +92 308 6222283
                </a>
              </li>
              <li className="contact-item">
                <span className="contact-icon-wrap">
                  <Mail className="contact-icon" />
                </span>
                <a href="mailto:info@pentapeaks.com" className="contact-link break-all">
                  info@pentapeaks.com
                </a>
              </li>
              <li className="contact-item">
                <span className="contact-icon-wrap">
                  <Clock className="contact-icon" />
                </span>
                <span>
                  Mon-Fri: 9AM - 6PM (PKT)<br />Sat: 10AM - 2PM
                </span>
              </li>
            </ul>
          </div>

          {/* ── Contact (USA) ── */}
          <div className="col-contact">
            <h4 className="col-head">USA Office</h4>
            <ul className="contact-list">
              <li className="contact-item">
                <span className="contact-icon-wrap">
                  <MapPin className="contact-icon" />
                </span>
                <a href="https://maps.app.goo.gl/hCMk6zYuUSmsp4MK7" target="_blank" rel="noopener noreferrer" className="contact-link">
                  237 N 13th St, Allentown,<br />PA 18102, USA
                </a>
              </li>
              <li className="contact-item">
                <span className="contact-icon-wrap">
                  <Phone className="contact-icon" />
                </span>
                <a href="tel:+16096355116" className="contact-link">
                  +1 609 635 5116
                </a>
              </li>
              <li className="contact-item">
                <span className="contact-icon-wrap">
                  <Mail className="contact-icon" />
                </span>
                <a href="mailto:info@pentapeaks.com" className="contact-link break-all">
                  info@pentapeaks.com
                </a>
              </li>
              <li className="contact-item">
                <span className="contact-icon-wrap">
                  <Clock className="contact-icon" />
                </span>
                <span>
                  Mon-Fri: 9AM - 5PM (EST)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} Penta Peaks International. All rights
            reserved.
          </p>
          <div className="footer-legal">
            <Link href="/privacy" className="legal-link">
              Privacy Policy
            </Link>
            <span className="legal-sep" />
            <Link href="/terms" className="legal-link">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* ── All styles scoped inside footer ── */}
      <style>{`
        /* ─── Reset & tokens ─── */
        .footer-root {
          --clr-primary:   #22c55e;        /* green accent */
          --clr-primary-d: #16a34a;
          --clr-dark:      #0a0d0a;
          --clr-card:      #111611;
          --clr-border:    rgba(255,255,255,.07);
          --clr-muted:     #6b7280;
          --clr-body:      #9ca3af;
          --clr-white:     #f9fafb;
          --ff-display:    'Georgia', 'Times New Roman', serif;
          --ff-body:       system-ui, -apple-system, sans-serif;
          --radius:        12px;
          font-family: var(--ff-body);
        }

        /* ─── CTA Band ─── */
        .cta-band {
          background: #f0fdf4;
          position: relative;
          overflow: hidden;
          padding: 5rem 1.5rem;
        }
        .cta-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .cta-inner {
          position: relative;
          max-width: 680px;
          margin: 0 auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.1rem;
        }
        .cta-eyebrow {
          display: inline-block;
          font-size: .7rem;
          font-weight: 700;
          letter-spacing: .25em;
          text-transform: uppercase;
          color: var(--clr-primary-d);
          background: rgba(34,197,94,.12);
          border: 1px solid rgba(34,197,94,.25);
          padding: .3rem .9rem;
          border-radius: 99px;
        }
        .cta-heading {
          font-family: var(--ff-display);
          font-size: clamp(2.4rem, 6vw, 4rem);
          font-weight: 700;
          color: #0a0d0a;
          line-height: 1.05;
          margin: 0;
          letter-spacing: -.02em;
        }
        .cta-heading em {
          font-style: normal;
          color: var(--clr-primary-d);
          position: relative;
        }
        .cta-heading em::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          bottom: .05em;
          height: 3px;
          background: var(--clr-primary);
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left;
          animation: underlineIn .6s .4s cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes underlineIn {
          to { transform: scaleX(1); }
        }
        .cta-sub {
          font-size: .95rem;
          color: #374151;
          line-height: 1.7;
          max-width: 520px;
          margin: 0;
        }
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          margin-top: .5rem;
          padding: .85rem 2.2rem;
          background: var(--clr-dark);
          color: var(--clr-white);
          font-size: .8rem;
          font-weight: 700;
          letter-spacing: .12em;
          text-decoration: none;
          border-radius: var(--radius);
          transition: background .2s, transform .2s, gap .2s;
        }
        .cta-btn:hover {
          background: var(--clr-primary-d);
          transform: translateY(-2px);
          gap: .75rem;
        }
        .cta-icon {
          width: 16px; height: 16px;
          transition: transform .2s;
        }
        .cta-btn:hover .cta-icon { transform: translate(2px,-2px); }

        /* ─── Dark Footer ─── */
        .dark-footer {
          background: var(--clr-dark);
          color: var(--clr-body);
        }
        .footer-top-rule {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--clr-primary) 40%, transparent);
          opacity: .35;
        }

        /* ─── Grid ─── */
        .footer-grid-wrap {
          max-width: 1280px;
          margin: 0 auto;
          padding: 4rem 1.5rem 3rem;
          display: grid;
          grid-template-columns: 1.2fr 0.9fr 0.9fr 1fr 1fr;
          gap: 2rem 2.5rem;
        }
        @media (max-width: 1024px) {
          .footer-grid-wrap {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 600px) {
          .footer-grid-wrap {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }

        /* ─── Brand col ─── */
        .col-brand { display: flex; flex-direction: column; gap: .9rem; }
        .brand-logo-row {
          display: flex; align-items: center; gap: .75rem;
        }
        .brand-logo {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--clr-primary), var(--clr-primary-d));
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 0 6px rgba(34,197,94,.1);
        }
        .brand-initial {
          font-family: var(--ff-display);
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }
        .brand-text { display: flex; flex-direction: column; }
        .brand-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--clr-white);
          font-family: var(--ff-display);
          line-height: 1.2;
        }
        .brand-tagline {
          font-size: .62rem;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: var(--clr-muted);
        }
        .brand-desc {
          font-size: .82rem;
          line-height: 1.75;
          color: var(--clr-body);
          margin: 0;
        }

        /* Social */
        .social-row { display: flex; gap: .5rem; flex-wrap: wrap; }
        @media (max-width: 600px) { .social-row { justify-content: center; } }
        .social-pill {
          width: 36px; height: 36px;
          border-radius: 9px;
          border: 1px solid var(--clr-border);
          display: flex; align-items: center; justify-content: center;
          font-size: .7rem; font-weight: 700;
          color: var(--clr-body);
          text-decoration: none;
          transition: border-color .2s, color .2s, background .2s, transform .2s;
        }
        .social-pill:hover {
          border-color: var(--clr-primary);
          color: var(--clr-primary);
          background: rgba(34,197,94,.08);
          transform: translateY(-2px);
        }
        .social-svg { width: 14px; height: 14px; }

        /* ─── Link cols ─── */
        .col-links, .col-contact { display: flex; flex-direction: column; gap: 1rem; }
        .col-head {
          font-size: .7rem;
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--clr-white);
          margin: 0;
          padding-bottom: .6rem;
          border-bottom: 1px solid var(--clr-border);
        }
        .link-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .55rem; }
        .footer-link {
          display: inline-flex;
          align-items: center;
          gap: .45rem;
          font-size: .82rem;
          color: var(--clr-body);
          text-decoration: none;
          transition: color .2s, gap .2s;
        }
        .footer-link:hover { color: var(--clr-primary); gap: .65rem; }
        .link-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--clr-muted);
          flex-shrink: 0;
          transition: background .2s, transform .2s;
        }
        .footer-link:hover .link-dot {
          background: var(--clr-primary);
          transform: scale(1.4);
        }

        /* ─── Contact col ─── */
        .contact-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .85rem; }
        .contact-item {
          display: flex; align-items: flex-start; gap: .75rem;
          font-size: .82rem; line-height: 1.6;
        }
        @media (max-width: 600px) { .contact-item { justify-content: center; text-align: left; } }
        .contact-icon-wrap {
          width: 28px; height: 28px;
          border-radius: 7px;
          background: rgba(34,197,94,.1);
          border: 1px solid rgba(34,197,94,.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          margin-top: .05rem;
          transition: background .2s;
        }
        .contact-item:hover .contact-icon-wrap { background: rgba(34,197,94,.18); }
        .contact-icon { width: 13px; height: 13px; color: var(--clr-primary); }
        .contact-link {
          color: var(--clr-body);
          text-decoration: none;
          transition: color .2s;
        }
        .contact-link:hover { color: var(--clr-primary); }

        /* ─── Bottom bar ─── */
        .footer-bottom {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1.4rem 1.5rem;
          border-top: 1px solid var(--clr-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        @media (max-width: 500px) { .footer-bottom { flex-direction: column; } }
        .footer-copy { font-size: .75rem; color: var(--clr-muted); margin: 0; }
        .footer-legal { display: flex; align-items: center; gap: .75rem; }
        .legal-link {
          font-size: .75rem;
          color: var(--clr-muted);
          text-decoration: none;
          transition: color .2s;
        }
        .legal-link:hover { color: var(--clr-primary); }
        .legal-sep {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: var(--clr-muted);
          display: inline-block;
        }
      `}</style>
    </footer>
  )
}