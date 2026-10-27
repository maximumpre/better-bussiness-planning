/**
 * Resolved image URLs for the Astro pages.
 *
 * CRITICAL: When importing assets via Vite/Astro, imported images return an
 * ImageMetadata OBJECT ({ src, width, height, format }), not a URL string.
 * Interpolating the object directly renders `src="[object Object]"` in <img>.
 *
 * This module exports safe URL strings for public/ assets.
 */

export const toImageUrl = (asset: string | { src: string }): string =>
  typeof asset === "string" ? asset : encodeURI(asset.src)

/** BBP Admin / Alegeus WealthCare logo (public/). */
export const BRAND_LOGO_SRC =
  "/BBPAdmin_Alegeus_Logo_Blue_Service.4ec5724d58c34a02b47bdfd467112a82.png"

/** No separate hero image on this login shell — preload logo for LCP. */
export const HERO_IMAGE_SRC = BRAND_LOGO_SRC

export const PARTNER_LOGO_SRC = BRAND_LOGO_SRC
