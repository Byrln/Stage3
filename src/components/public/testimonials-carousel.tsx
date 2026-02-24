"use client";

import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import {AnimatePresence, motion} from "framer-motion";
import {Star} from "lucide-react";

type Testimonial = {
  id: string;
  name: string;
  country: string;
  flag: string;
  tourName: string;
  rating: number;
  text: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Sara M.",
    country: "Germany",
    flag: "🇩🇪",
    tourName: "Bhutan Monastery Circuit",
    rating: 5,
    text: "Every detail was taken care of. Our guide felt like an old friend showing us their home.",
  },
  {
    id: "2",
    name: "Kenji T.",
    country: "Japan",
    flag: "🇯🇵",
    tourName: "Gobi Desert Stargazing",
    rating: 5,
    text: "The night sky in the Gobi was unreal. Small group, authentic camps, unforgettable moments.",
  },
  {
    id: "3",
    name: "Amira L.",
    country: "UAE",
    flag: "🇦🇪",
    tourName: "Nepal Peaks and Temples",
    rating: 4.8,
    text: "Perfect balance of trekking and culture. We always felt safe, supported, and inspired.",
  },
  {
    id: "4",
    name: "Lucas P.",
    country: "Brazil",
    flag: "🇧🇷",
    tourName: "Mekong Delta Slow Journey",
    rating: 4.9,
    text: "Slow travel at its best. Local food, river life, and meaningful conversations everywhere.",
  },
];

export function TestimonialsCarousel() {
  const t = useTranslations("public.testimonials");
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 7000);

    return () => window.clearInterval(id);
  }, [isHovered]);

  const visible = [
    TESTIMONIALS[index],
    TESTIMONIALS[(index + 1) % TESTIMONIALS.length],
    TESTIMONIALS[(index + 2) % TESTIMONIALS.length],
  ];

  return (
    <section
      className="bg-neutral-950 py-16 text-neutral-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 font-heading text-2xl tracking-tight sm:text-3xl">{t("title")}</h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-300">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <button
              type="button"
              className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1"
              onClick={() => setIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            >
              {t("prev")}
            </button>
            <button
              type="button"
              className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1"
              onClick={() => setIndex((prev) => (prev + 1) % TESTIMONIALS.length)}
            >
              {t("next")}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <AnimatePresence initial={false}>
            {visible.map((item) => (
              <motion.article
                key={item.id}
                className="flex h-full flex-col justify-between rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                transition={{duration: 0.35}}
              >
                <div className="mb-4 text-4xl leading-none text-emerald-400">“</div>
                <p className="flex-1 text-sm text-neutral-200">{item.text}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-neutral-50">
                      {item.name} · {item.flag}
                    </div>
                    <div className="text-xs text-neutral-400">{item.tourName}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-xs text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-amber-400" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-[11px] text-neutral-500">{t("verified")}</div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex justify-center gap-1.5">
          {TESTIMONIALS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-emerald-400" : "w-2 bg-neutral-700"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

