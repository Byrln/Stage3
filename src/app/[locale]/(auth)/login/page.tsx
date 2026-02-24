import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {LoginForm} from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login - Tripsaas",
};

type LoginPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LoginPage(props: LoginPageProps) {
  const {params} = props;
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "auth.login"});

  return (
    <main className="flex min-h-screen bg-[radial-gradient(circle_at_top,_#e0fbfc,_transparent_60%),linear-gradient(to_bottom,_var(--background),_#f8f4e3)] text-neutral-900 dark:text-neutral-50">
      <section className="relative hidden w-0 flex-1 items-center justify-center overflow-hidden bg-neutral-900 md:flex">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[url('/images/auth-hero.jpg')] bg-cover bg-center opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/70 to-neutral-900/40" />
        </div>
        <div className="relative z-10 mx-auto max-w-xl px-10 py-16 text-neutral-50">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">{t("badge")}</p>
          <h1 className="mt-4 font-heading text-4xl leading-tight tracking-tight md:text-5xl">{t("headline")}</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-200">{t("subheadline")}</p>
          <figure className="mt-8 border-l-2 border-emerald-400/80 pl-4 text-sm text-neutral-100">
            <blockquote>{t("quote")}</blockquote>
            <figcaption className="mt-3 text-xs text-neutral-300">{t("quoteAttribution")}</figcaption>
          </figure>
        </div>
      </section>

      <section className="flex min-h-screen flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white shadow-sm">
              TS
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg tracking-tight">Tripsaas</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{t("tagline")}</span>
            </div>
          </div>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}

