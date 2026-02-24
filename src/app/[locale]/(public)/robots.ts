import type {MetadataRoute} from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://app.tripsaas.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api", "/dashboard"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

