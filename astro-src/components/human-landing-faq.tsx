/**
 * Below-fold zero-JS FAQ for the human Astro landing (cloaking parity with the twin).
 * Mount INSIDE LandingShell / SteinsGate children so cloaked direct visits never see it.
 * Twin FAQ lives in crawler-seo.astro — keep questions factually aligned.
 */
import { SITE_DISPLAY_NAME } from "@/lib/site-url"

const FAQS = [
  {
    q: "How do I register or sign in to my BBP Admin WealthCare portal?",
    a: "First-time members open Register on the sign-in card, enter name and ZIP code, and may enter a Benefits Debit Card number to speed enrollment. Complete email or SMS verification, create a User ID and password, answer four security questions, then sign in. Existing members enter User ID and password; a one-time code may be sent by email or text.",
  },
  {
    q: "What should I do if I forgot my User ID or password?",
    a: "Use Forgot your Username to open the self-service User Name Retrieval flow, or Forgot your Password for password reset. Member Support at (630) 773-2337 and support@bbpadmin.com can also help after identity verification. Never share one-time codes with callers.",
  },
  {
    q: "How do I activate and use my Benefits Debit Card for eligible medical expenses?",
    a: "After sign-in, open debit card details from your account menu. Activate the card if prompted, then use it at point of sale for eligible medical, dental, vision, or other plan-qualified expenses. Keep itemized receipts; some purchases require portal substantiation.",
  },
  {
    q: "What is the deadline to submit FSA claims and what happens to unused funds?",
    a: "Medical FSA claims must be submitted by your employer plan run-out date after the plan year ends. Unused funds may be forfeited under use-it-or-lose-it rules unless your plan offers a grace period or carryover. Check your plan summary or contact Member Support for your exact deadlines.",
  },
  {
    q: "How can I check my HSA or FSA balance and contribution limits?",
    a: "Sign in to view account summary balances for HSA, FSA, HRA, dependent care FSA (DCAP), and transit accounts. You can also text BAL to 97487 from a registered mobile number for current-year balances.",
  },
  {
    q: `Who do I contact for ${SITE_DISPLAY_NAME} benefits card replacement or account support?`,
    a: "Call Member Support at (630) 773-2337, email support@bbpadmin.com, or email claims@bbpadmin.com for claim questions. Download the BBP Admin Mobile app from the App Store or Google Play for balances, receipt photos, and claims on the go.",
  },
] as const

export function HumanLandingFaq() {
  return (
    <section
      className="mt-10 max-w-xl mx-auto px-4 pb-12 text-sm text-neutral-600"
      aria-labelledby="human-landing-faq-heading"
    >
      <h2
        id="human-landing-faq-heading"
        className="text-base font-semibold text-neutral-900 mb-3"
      >
        Frequently asked questions
      </h2>
      <div className="space-y-2">
        {FAQS.map((item) => (
          <details
            key={item.q}
            className="rounded-md border border-neutral-200 bg-neutral-50/50 p-3"
          >
            <summary className="cursor-pointer font-medium text-neutral-800">
              {item.q}
            </summary>
            <p className="mt-2 text-neutral-600 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
