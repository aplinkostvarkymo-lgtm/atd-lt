import type { MetadataRoute } from "next";

const BASE_URL = "https://atd.lt";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/paslaugos/veja`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/paslaugos/apzeldinimas`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/paslaugos/laistymas`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/paslaugos/trinkeles`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
