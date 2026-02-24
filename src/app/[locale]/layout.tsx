import type {ReactNode} from "react";
import {notFound} from "next/navigation";
import {NextIntlClientProvider} from "next-intl";
import {getMessages, setRequestLocale} from "next-intl/server";
import {locales, type AppLocale} from "@/lib/i18n";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleLayout(props: LocaleLayoutProps) {
  const {children, params} = props;
  const {locale} = await params;

  if (!locales.includes(locale as AppLocale)) {
    notFound();
  }

  setRequestLocale(locale as AppLocale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
