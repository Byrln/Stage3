import {useTranslations} from "next-intl";

const FEATURED_DESTINATIONS = [
  {
    key: "gobi",
    name: "Gobi Desert",
    imageUrl: "/images/destinations/gobi-desert.jpg",
    toursCount: 8,
  },
  {
    key: "himalayas",
    name: "Himalayas",
    imageUrl: "/images/destinations/himalayas.jpg",
    toursCount: 12,
  },
  {
    key: "mekong",
    name: "Mekong Delta",
    imageUrl: "/images/destinations/mekong-delta.jpg",
    toursCount: 6,
  },
  {
    key: "angkor",
    name: "Angkor Wat",
    imageUrl: "/images/destinations/angkor-wat.jpg",
    toursCount: 5,
  },
  {
    key: "bhutan",
    name: "Bhutan Dzongs",
    imageUrl: "/images/destinations/bhutan-dzongs.jpg",
    toursCount: 4,
  },
  {
    key: "alps",
    name: "Japanese Alps",
    imageUrl: "/images/destinations/japanese-alps.jpg",
    toursCount: 7,
  },
];

export function FeaturedDestinations() {
  const t = useTranslations("public.destinations");

  return (
    <section id="destinations" className="bg-neutral-50 py-16 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-emerald-500 to-emerald-300" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-300">
                {t("eyebrow")}
              </span>
            </div>
            <h2 className="mt-3 font-heading text-2xl tracking-tight sm:text-3xl">{t("title")}</h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-600 dark:text-neutral-400">{t("subtitle")}</p>
          </div>
          <button className="hidden rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:bg-neutral-800 sm:inline-flex">
            {t("cta")}
          </button>
        </div>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {FEATURED_DESTINATIONS.map((destination) => (
            <article
              key={destination.key}
              className="mb-4 overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-100/60 shadow-sm shadow-neutral-200/50 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-neutral-300/60 dark:border-neutral-800 dark:bg-neutral-900/80 dark:shadow-none"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={destination.imageUrl}
                  alt={destination.name}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-sm text-neutral-50">
                  <div>
                    <h3 className="font-semibold leading-tight">{destination.name}</h3>
                    <p className="text-xs text-neutral-200">
                      {destination.toursCount} {t("toursLabel")}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] backdrop-blur-sm">
                    {t("badge")}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
          <button className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:bg-neutral-800">
            {t("cta")}
          </button>
        </div>
      </div>
    </section>
  );
}

