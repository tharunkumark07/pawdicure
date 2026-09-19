/**
 * Utility to dynamically update the document favicon and browser theme-color
 * based on the active application theme.
 */

export function generateFaviconSvg(themeColor: string): string {
  // Return an SVG representing the PAWdiCURE brand paw badge in the current theme color
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect x="4" y="4" width="92" height="92" rx="26" fill="${themeColor}" stroke="rgba(255, 255, 255, 0.35)" stroke-width="4"/>
    <path d="M32 64 C28 50 36 38 48 38 C56 38 64 45 68 54 C72 64 64 74 50 74 C38 74 34 70 32 64 Z" fill="#ffffff"/>
    <ellipse cx="28" cy="36" rx="7" ry="10" transform="rotate(-20 28 36)" fill="#ffffff"/>
    <ellipse cx="43" cy="26" rx="7.5" ry="11" transform="rotate(-6 43 26)" fill="#ffffff"/>
    <ellipse cx="59" cy="26" rx="7.5" ry="11" transform="rotate(6 59 26)" fill="#ffffff"/>
    <ellipse cx="74" cy="36" rx="7" ry="10" transform="rotate(20 74 36)" fill="#ffffff"/>
  </svg>`;
}

/**
 * Updates the document favicon link tag and mobile browser theme-color meta tag
 * to match the provided theme color.
 *
 * @param themeColor The hex or rgb string representing the current theme's primary color
 */
export function updateDocumentFavicon(themeColor: string): void {
  if (typeof document === 'undefined' || !themeColor) return;

  try {
    const svgString = generateFaviconSvg(themeColor);
    const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

    // 1. Update or create the primary <link rel="icon">
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = dataUri;

    // 2. Also update or create <link rel="shortcut icon"> for legacy browser support
    let shortcutLink = document.querySelector<HTMLLinkElement>("link[rel='shortcut icon']");
    if (!shortcutLink) {
      shortcutLink = document.createElement('link');
      shortcutLink.rel = 'shortcut icon';
      document.head.appendChild(shortcutLink);
    }
    shortcutLink.type = 'image/svg+xml';
    shortcutLink.href = dataUri;

    // 3. Synchronize mobile browser header & window frame via <meta name="theme-color">
    let themeMeta = document.querySelector<HTMLMetaElement>("meta[name='theme-color']");
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.name = 'theme-color';
      document.head.appendChild(themeMeta);
    }
    themeMeta.content = themeColor;
  } catch (error) {
    console.warn('Failed to update document favicon:', error);
  }
}
