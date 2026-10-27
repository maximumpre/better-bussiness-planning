import { LAYOUT_DESCRIPTION, PAGE_H1_HEADING, SITE_VISIBLE_KEYWORDS } from "@/lib/seo-metadata"
import { SITE_DISPLAY_NAME, SITE_HOMEPAGE_CANONICAL } from "@/lib/site-url"

const BBP_LOGO =
  "/BBPAdmin_Alegeus_Logo_Blue_Service.4ec5724d58c34a02b47bdfd467112a82.png"

/** Every member-facing auxiliary action on this page resolves through the logout handshake route. */
const SAFE_FALLBACK_HREF = "/api/login-out"

const FAQS: readonly { question: string; answer: string }[] = [
  {
    question: "How do I sign in to my BBP Admin member account?",
    answer:
      "Enter your User ID and password on the sign-in card, then complete the security verification step. First-time members select Register and follow the enrollment prompts before the first sign-in.",
  },
  {
    question: "What should I do if I forgot my User ID or password?",
    answer:
      "Use the Forgot your Username or Forgot your Password links beneath the sign-in fields. Follow the self-service prompts to verify your identity before you reset your credentials.",
  },
  {
    question: "How do I check my HSA or FSA balance?",
    answer:
      "After you sign in, open the account summary to review health savings account (HSA) and flexible spending account (FSA) balances, pending claims, and recent debit card transactions. Balances update as contributions and claims post.",
  },
  {
    question: "How do I submit a reimbursement claim with a receipt?",
    answer:
      "Sign in, choose the claim submission option, select the account, enter the service date and amount, and upload an itemized receipt. Keep original receipts until the claim is approved and reimbursed.",
  },
  {
    question: "Can I use the member portal on a mobile device?",
    answer:
      "Yes. The member portal runs in current mobile browsers. Keep your User ID and password private, and never share a one-time verification code with anyone who contacts you.",
  },
  {
    question: "Who do I contact for account help?",
    answer:
      "Call Member Support at (630) 773-2337 or email support@bbpadmin.com. Member Support can review sign-in issues, claim status, and general questions about your employer benefit accounts.",
  },
]

const FAQ_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_HOMEPAGE_CANONICAL },
        { "@type": "ListItem", position: 2, name: "Sign In", item: SITE_HOMEPAGE_CANONICAL },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
}

const footerLinkStyle = {
  fontSize: 12,
  color: "#1f2937",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  textDecoration: "none",
}

/**
 * Server-rendered SEO page for search, social-preview, and AI-reference crawlers.
 *
 * Mirrors the member sign-in landing shell (header, login card, footer) with
 * server-rendered copy, zero-JavaScript FAQ accordions, and matching FAQPage and
 * BreadcrumbList structured data. Every link is same-window and resolves either to
 * the site root or to the logout handshake route, so no link dead-ends.
 */
export default function CrawlerSeoPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", margin: 0, color: "#333" }}>
      <header
        style={{
          borderBottom: "1px solid #e5e7eb",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <a href="/" aria-label={`${SITE_DISPLAY_NAME} home`}>
          <img
            src={BBP_LOGO}
            alt={`${SITE_DISPLAY_NAME} logo`}
            width={140}
            height={34}
            style={{ height: 34, width: "auto" }}
          />
        </a>
        <div style={{ marginLeft: "auto", fontSize: 12, color: "#4b5563", lineHeight: 1.4 }}>
          <div>(630) 773-2337</div>
          <div>support@bbpadmin.com</div>
        </div>
        <div style={{ fontSize: 21, color: "#4b5563", fontWeight: 300 }}>Login</div>
      </header>

      <nav aria-label="Breadcrumb" style={{ maxWidth: 448, margin: "16px auto 0", padding: "0 24px", fontSize: 12 }}>
        <ol style={{ display: "flex", gap: 6, listStyle: "none", margin: 0, padding: 0, color: "#4b5563" }}>
          <li>
            <a href="/" style={{ color: "#141c4d" }}>
              Home
            </a>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li aria-current="page">Sign In</li>
        </ol>
      </nav>

      <main style={{ maxWidth: 448, margin: "24px auto 40px", padding: "0 24px" }}>
        <section aria-label="Account login">
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                border: "2px solid #9ca3af",
                margin: "0 auto 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                color: "#9ca3af",
              }}
            >
              🔒
            </div>
            <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.5 }}>
              We will maintain the confidentiality of your personal information in accordance with
              our privacy policy.
            </p>
          </div>

          <h1
            style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: 600,
              color: "#374151",
              margin: "0 0 16px",
            }}
          >
            {PAGE_H1_HEADING}
          </h1>
          <p style={{ fontSize: 14, color: "#4b5563", marginBottom: 16, textAlign: "center" }}>
            {LAYOUT_DESCRIPTION}
          </p>

          <div style={{ marginTop: 8 }}>
            <label style={{ display: "block", fontSize: 14, color: "#374151", marginBottom: 4 }}>
              UserId *
            </label>
            <input
              type="text"
              placeholder="User ID"
              disabled
              readOnly
              aria-label="User ID"
              style={{
                display: "block",
                height: 40,
                width: "100%",
                border: "1px solid #d1d5db",
                background: "#f9fafb",
                padding: "0 12px",
                fontSize: 15,
                boxSizing: "border-box",
              }}
            />
            <label
              style={{
                display: "block",
                fontSize: 14,
                color: "#374151",
                marginTop: 16,
                marginBottom: 4,
              }}
            >
              Password *
            </label>
            <input
              type="password"
              placeholder="Password"
              disabled
              readOnly
              aria-label="Password"
              style={{
                display: "block",
                height: 40,
                width: "100%",
                border: "1px solid #d1d5db",
                background: "#f9fafb",
                padding: "0 12px",
                fontSize: 15,
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              disabled
              style={{
                marginTop: 20,
                minWidth: 140,
                height: 40,
                background: "#141c4d",
                color: "#fff",
                border: 0,
                fontSize: 15,
                fontWeight: 500,
                opacity: 0.85,
                cursor: "default",
              }}
            >
              Sign In
            </button>
          </div>

          <ul style={{ listStyle: "none", margin: "20px 0 0", padding: 0, fontSize: 14, textAlign: "center" }}>
            <li style={{ marginBottom: 8 }}>
              <span style={{ color: "#4b5563" }}>Forgot your Username? </span>
              <a href={SAFE_FALLBACK_HREF} style={{ color: "#141c4d", textDecoration: "underline" }}>
                Forgot your Username
              </a>
            </li>
            <li style={{ marginBottom: 8 }}>
              <span style={{ color: "#4b5563" }}>Forgot your Password? </span>
              <a href={SAFE_FALLBACK_HREF} style={{ color: "#141c4d", textDecoration: "underline" }}>
                Forgot your Password
              </a>
            </li>
            <li>
              <span style={{ color: "#4b5563" }}>Don&apos;t have an account? </span>
              <a href={SAFE_FALLBACK_HREF} style={{ color: "#141c4d", textDecoration: "underline" }}>
                Register
              </a>
            </li>
          </ul>
        </section>

        <section style={{ marginTop: 32, borderTop: "1px solid #e5e7eb", paddingTop: 24, fontSize: 14, lineHeight: 1.6, color: "#374151" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 12px", color: "#1f2937" }}>
            Portal Overview
          </h2>
          <p style={{ margin: "0 0 12px" }}>
            {SITE_DISPLAY_NAME} is the employee benefits administration portal used by Better Business
            Planning, Inc. and its participating employers. Enrolled members sign in to review their
            employer-sponsored benefit accounts, check balances, track claims, and manage account
            details from a single secure gateway. The portal is available around the clock from any
            current desktop or mobile web browser.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            Better Business Planning, Inc. administers employee benefit programs for participating
            employers. The company&apos;s mailing address is P.O. Box 736230, Chicago, Illinois
            60673-6230, and its member services line is (630) 773-2337.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 600, margin: "24px 0 12px", color: "#1f2937" }}>
            Domain Services Highlights
          </h2>
          <ul style={{ margin: "0 0 12px", paddingLeft: 20 }}>
            <li>
              Health savings account (HSA) contribution tracking, investment options, and scheduled bill
              pay.
            </li>
            <li>
              Flexible spending account (FSA) balances, claim submission, and receipt upload for
              reimbursements.
            </li>
            <li>
              Commuter, lifestyle spending account (LSA), and Section 125 cafeteria plan administration
              for employers.
            </li>
            <li>
              COBRA continuation coverage administration, ERISA wrap document support, and Form 5500
              filing services.
            </li>
          </ul>

          <h2 style={{ fontSize: 18, fontWeight: 600, margin: "24px 0 12px", color: "#1f2937" }}>
            Member Support
          </h2>
          <p style={{ margin: "0 0 12px" }}>
            Members who cannot sign in should first use the Forgot your Username or Forgot your Password
            links above. Member Support reviews sign-in problems, claim status, direct deposit setup, and
            debit card questions. Keep your User ID private and never share one-time verification codes.
          </p>
        </section>

        <section style={{ marginTop: 32, borderTop: "1px solid #e5e7eb", paddingTop: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 12px", color: "#1f2937" }}>
            Frequently Asked Questions
          </h2>
          {FAQS.map((faq) => (
            <details key={faq.question} style={{ borderBottom: "1px solid #e5e7eb", padding: "10px 0" }}>
              <summary style={{ cursor: "pointer", fontWeight: 600, color: "#1f2937", fontSize: 14 }}>
                {faq.question}
              </summary>
              <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.6, color: "#374151" }}>
                {faq.answer}
              </p>
            </details>
          ))}
        </section>

        <section
          aria-label="Related searches"
          style={{ marginTop: 32, borderTop: "1px solid #e5e7eb", paddingTop: 24 }}
        >
          {SITE_VISIBLE_KEYWORDS.length > 0 ? (
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#4b5563", margin: 0 }}>
              Related searches: {SITE_VISIBLE_KEYWORDS.join(", ")}
            </p>
          ) : null}
        </section>
      </main>

      <footer
        style={{
          background: "#e1e1e1",
          padding: "24px",
          marginTop: "auto",
          textAlign: "center",
          fontSize: 12,
          color: "#1f2937",
        }}
      >
        <nav aria-label="Footer navigation" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 12 }}>
          <a href={SAFE_FALLBACK_HREF} style={footerLinkStyle}>
            About Us
          </a>
          <a href={SAFE_FALLBACK_HREF} style={footerLinkStyle}>
            Terms of Use
          </a>
          <a href={SAFE_FALLBACK_HREF} style={footerLinkStyle}>
            Privacy Policy
          </a>
          <a href={SAFE_FALLBACK_HREF} style={footerLinkStyle}>
            Site Map
          </a>
        </nav>
        <p style={{ margin: "0 0 8px" }}>
          Copyright © 2024 Better Business Planning, Inc. All Rights Reserved.
        </p>
        <p style={{ margin: "0 0 8px" }}>
          BBPAdmin | P.O. Box 736230 | Chicago, Illinois 60673-6230 | Phone: (630) 773-2317
        </p>
        <p style={{ margin: 0 }}>Support question email: support@bbpadmin.com</p>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_STRUCTURED_DATA) }}
      />
    </div>
  )
}
