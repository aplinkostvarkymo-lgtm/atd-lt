import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    deviceSizes: [375, 768, 1280, 1920],
    imageSizes: [300, 600],
  },

  async redirects() {
    return [
      // ── Pagrindinis ───────────────────────────────────────────
      { source: "/lt",       destination: "/", permanent: true },
      { source: "/lt.php",   destination: "/", permanent: true },
      { source: "/index.php",destination: "/", permanent: true },
      { source: "/en",       destination: "/", permanent: true },
      { source: "/en.php",   destination: "/", permanent: true },

      // ── Svetainės medis / paieška ──────────────────────────────
      { source: "/lt/site-tree", destination: "/", permanent: true },
      { source: "/en/site-tree", destination: "/", permanent: true },
      { source: "/lt/search",    destination: "/", permanent: true },
      { source: "/en/search",    destination: "/", permanent: true },

      // ── Veja ──────────────────────────────────────────────────
      { source: "/lt/pages/2187/:path*", destination: "/paslaugos/veja", permanent: true },
      { source: "/lt/pages/2193/:path*", destination: "/paslaugos/veja", permanent: true },
      { source: "/lt/pages/2199/:path*", destination: "/paslaugos/veja", permanent: true },

      // ── Apželdinimas ──────────────────────────────────────────
      { source: "/lt/pages/2188/:path*", destination: "/paslaugos/apzeldinimas", permanent: true },
      { source: "/lt/pages/2190/:path*", destination: "/paslaugos/apzeldinimas", permanent: true },
      { source: "/lt/pages/1934/:path*", destination: "/paslaugos/apzeldinimas", permanent: true },

      // ── Tvenkiniai ────────────────────────────────────────────
      { source: "/lt/pages/1937/:path*", destination: "/paslaugos/tvenkiniai", permanent: true },
      { source: "/lt/pages/2194/:path*", destination: "/paslaugos/tvenkiniai", permanent: true },
      { source: "/lt/pages/2196/:path*", destination: "/paslaugos/tvenkiniai", permanent: true },

      // ── Kontaktai ─────────────────────────────────────────────
      { source: "/lt/pages/1947/:path*", destination: "/kontaktai", permanent: true },

      // ── Pagrindinis (kaina, bendri puslapiai) ─────────────────
      { source: "/lt/pages/1944/:path*", destination: "/", permanent: true },
      { source: "/lt/pages/1932/:path*", destination: "/", permanent: true },
      { source: "/lt/pages/1941/:path*", destination: "/", permanent: true },
      { source: "/lt/pages/1933/:path*", destination: "/", permanent: true },
      { source: "/lt/pages/1942/:path*", destination: "/", permanent: true },
      { source: "/lt/pages/1945/:path*", destination: "/", permanent: true },
      { source: "/lt/pages/2013/:path*", destination: "/", permanent: true },
      { source: "/lt/pages/1946/:path*", destination: "/", permanent: true },
      { source: "/lt/pages/2191/:path*", destination: "/", permanent: true },

      // ── Kitos paslaugos (neturi naujo puslapio) ────────────────
      { source: "/lt/pages/1936/:path*", destination: "/", permanent: true },
      { source: "/lt/pages/1935/:path*", destination: "/", permanent: true },
      { source: "/lt/pages/1938/:path*", destination: "/", permanent: true },
      { source: "/lt/pages/2192/:path*", destination: "/", permanent: true },
      { source: "/lt/pages/2131/:path*", destination: "/", permanent: true },
      { source: "/lt/pages/2195/:path*", destination: "/", permanent: true },
      { source: "/lt/pages/2132/:path*", destination: "/", permanent: true },
      { source: "/lt/pages/2189/:path*", destination: "/", permanent: true },

      // ── Galerija, karjera, misc ───────────────────────────────
      { source: "/lt/gallery/:path*",    destination: "/", permanent: true },
      { source: "/lt/pages/1948/:path*", destination: "/", permanent: true },
      { source: "/lt/pages/1949/:path*", destination: "/", permanent: true },
      { source: "/lt/pages/2198/:path*", destination: "/", permanent: true },

      // ── Atsarginė taisyklė: visi kiti /lt/pages/... ──────────
      { source: "/lt/pages/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
