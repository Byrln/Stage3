import {getRequestConfig} from "next-intl/server";

export const locales = [
  "en",
  "zh",
  "ja",
  "ko",
  "mn",
  "fr",
  "de",
  "es",
  "ar",
  "hi",
] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "mn";

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = (locales as readonly string[]).includes(requested ?? "")
    ? (requested as AppLocale)
    : defaultLocale;

  let messages;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch {
    messages = (await import("../messages/en.json")).default;
  }

  return {
    locale,
    messages,
  };
});
