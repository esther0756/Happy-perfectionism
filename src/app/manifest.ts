import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return {
    name: "행복한 완벽주의",
    short_name: "행복한 완벽주의",
    description: "조금 더 나다운, 조금 더 편안한",
    id: `${basePath}/`,
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#FAF8F0",
    theme_color: "#D28158",
    icons: [
      {
        src: `${basePath}/icons/flower-192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${basePath}/icons/flower-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${basePath}/icons/flower-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
