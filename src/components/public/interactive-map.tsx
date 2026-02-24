"use client";

import {useEffect, useRef} from "react";
import {useTranslations} from "next-intl";
import "leaflet/dist/leaflet.css";

type MapDestination = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  toursCount: number;
  imageUrl: string;
};

const DESTINATIONS: MapDestination[] = [
  {
    id: "gobi",
    name: "Gobi Desert, Mongolia",
    latitude: 43.5,
    longitude: 104.3,
    toursCount: 8,
    imageUrl: "/images/destinations/gobi-desert.jpg",
  },
  {
    id: "himalayas",
    name: "Himalayas, Nepal",
    latitude: 28.3,
    longitude: 84.0,
    toursCount: 12,
    imageUrl: "/images/destinations/himalayas.jpg",
  },
  {
    id: "mekong",
    name: "Mekong Delta, Vietnam",
    latitude: 10.0,
    longitude: 105.0,
    toursCount: 6,
    imageUrl: "/images/destinations/mekong-delta.jpg",
  },
  {
    id: "angkor",
    name: "Angkor Wat, Cambodia",
    latitude: 13.4125,
    longitude: 103.8667,
    toursCount: 5,
    imageUrl: "/images/destinations/angkor-wat.jpg",
  },
  {
    id: "bhutan",
    name: "Bhutan Dzongs, Bhutan",
    latitude: 27.47,
    longitude: 89.64,
    toursCount: 4,
    imageUrl: "/images/destinations/bhutan-dzongs.jpg",
  },
  {
    id: "alps",
    name: "Japanese Alps, Japan",
    latitude: 36.3,
    longitude: 137.6,
    toursCount: 7,
    imageUrl: "/images/destinations/japanese-alps.jpg",
  },
];

export function InteractiveMap() {
  const t = useTranslations("public.map");
  const mapRef = useRef<null | {remove: () => void}>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    let isMounted = true;

    async function initializeMap() {
      const L = await import("leaflet");

      if (!isMounted || !containerRef.current) {
        return;
      }

      const map = L.map(containerRef.current, {
        center: [23.5, 102.0],
        zoom: 4,
        minZoom: 3,
        maxZoom: 10,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      DESTINATIONS.forEach((destination) => {
        const marker = L.marker([destination.latitude, destination.longitude]).addTo(map);

        const popupHtml = `
          <div style="display:flex;gap:0.5rem;align-items:center;">
            <div style="width:56px;height:40px;overflow:hidden;border-radius:0.5rem;">
              <img src="${destination.imageUrl}" alt="${destination.name}" style="width:100%;height:100%;object-fit:cover;" />
            </div>
            <div style="font-size:11px;line-height:1.3;">
              <div style="font-weight:600;margin-bottom:2px;">${destination.name}</div>
              <div style="color:#4b5563;margin-bottom:4px;">${destination.toursCount} tours</div>
              <a href="#tours" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:999px;background:#047857;color:white;font-weight:600;font-size:10px;text-decoration:none;">
                ${t("viewToursCta")}
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupHtml);
      });

      mapRef.current = map;
    }

    void initializeMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [t]);

  return (
    <section className="bg-neutral-950 py-16 text-neutral-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 font-heading text-2xl tracking-tight sm:text-3xl">{t("title")}</h2>
            <p className="mt-3 text-sm text-neutral-300">{t("subtitle")}</p>
            <p className="mt-4 text-xs text-neutral-400">{t("helper")}</p>
          </div>
          <div className="relative h-80 overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-950/40 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]">
            <div
              ref={containerRef}
              className="h-full w-full"
              aria-label={t("mapLabel")}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

