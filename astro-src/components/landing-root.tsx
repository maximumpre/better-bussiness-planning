/**
 * Single React island entry for `/`.
 * Composes LandingShell + the real login UI so both share one client:only root
 * (nested client:only islands would break children wiring).
 */
"use client"

import LandingShell from "./landing-shell"
import LandingPage from "@/components/landing-page"

export default function LandingRoot({
  allowLocalTestingEnv = false,
}: {
  allowLocalTestingEnv?: boolean
}) {
  return (
    <LandingShell allowLocalTestingEnv={allowLocalTestingEnv}>
      <LandingPage />
    </LandingShell>
  )
}
