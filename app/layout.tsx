import type { Metadata } from "next"

import ProtectedLayout from "@/components/protected-layout"
import { StripExtensionAttrs } from "@/components/StripExtensionAttrs"
import { SeoJsonLd } from "@/components/structured-data"
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_TITLE } from "@/lib/seo-metadata"
import { INDEXABLE_PAGE_ROBOTS } from "@/lib/seo-robots-metadata"
import {
  SITE_DISPLAY_NAME,
  SITE_HOMEPAGE_CANONICAL,
  SITE_ORIGIN,
} from "@/lib/site-url"
import "./globals.css"

const SOCIAL_PREVIEW_IMAGE = "/og-image.png"
const OG_IMAGE = new URL(SOCIAL_PREVIEW_IMAGE, SITE_HOMEPAGE_CANONICAL).href

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_DISPLAY_NAME}`,
  },
  description: SITE_DESCRIPTION,
  ...(SITE_KEYWORDS.length > 0 ? { keywords: SITE_KEYWORDS } : {}),
  applicationName: SITE_DISPLAY_NAME,
  authors: [{ name: "Better Business Planning, Inc." }],
  creator: SITE_DISPLAY_NAME,
  publisher: "Better Business Planning, Inc.",
  robots: INDEXABLE_PAGE_ROBOTS,
  alternates: {
    canonical: SITE_HOMEPAGE_CANONICAL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_HOMEPAGE_CANONICAL,
    siteName: SITE_DISPLAY_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_DISPLAY_NAME} login`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  other: {
    "msapplication-TileImage": "/icon-48x48.png",
  },
}

export const dynamic = "force-dynamic"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-US" suppressHydrationWarning>
      <body className="min-h-full bg-white font-sans antialiased" suppressHydrationWarning>
        <StripExtensionAttrs />
        <SeoJsonLd />
        <ProtectedLayout>{children}</ProtectedLayout>
      </body>
    </html>
  )
}
