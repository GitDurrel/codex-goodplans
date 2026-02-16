import { useEffect, useState, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { CarouselItem } from "../../pages/HomePage/types";
import { PromoBannerPicture } from "../PromoBannerPicture";

interface SponsoredCarouselProps {
  items: CarouselItem[];
}

export function SponsoredCarousel({ items }: SponsoredCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const next = useCallback(
    () => setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1)),
    [items.length]
  );

  const prev = useCallback(
    () => setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1)),
    [items.length]
  );

  useEffect(() => {
    const interval = setInterval(next, 8000);
    return () => clearInterval(interval);
  }, [next]);

  const current = items[currentIndex];

  return (
    <section className="mt-10 mb-10 sm:mb-14">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.45)]">
        <div className="relative h-64 sm:h-72 md:h-80 lg:h-96"> {/* Augmentation légère de la hauteur */}
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className={`absolute inset-0 transition-opacity duration-700 ${index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
            >
              {/* UTILISATION DU PICTURE POUR LE CARROUSEL */}
              <PromoBannerPicture
                desktopSrc={item.image_desktop}
                mobileSrc={item.image_mobile || item.image_desktop}
                alt={item.title}
                className="block h-full w-full"
              />


              {/* Overlay plus sombre sur mobile pour la lisibilité du texte par-dessus l'image */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent sm:via-slate-950/40" />
            </div>
          ))}

          {/* Contenu texte */}
          <div className="relative z-10 flex h-full items-center px-6 py-6 sm:px-12">
            <div className="max-w-xl space-y-4 text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="opacity-90">
                  {current.sponsoredText || "Annonce sponsorisée"}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight drop-shadow-sm">
                {current.title}
              </h2>

              {current.description && (
                <p className="text-sm sm:text-base text-slate-100/90">
                  {current.description}
                </p>
              )}

              {current.visitUrl && (
                <a
                  href={current.visitUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900"
                >
                  {current.visitButtonText || "Découvrir"}
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Flèches navigation */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white shadow-md backdrop-blur hover:bg-black/60"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white shadow-md backdrop-blur hover:bg-black/60"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Petits dots en bas */}
        {items.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all ${index === currentIndex
                  ? "w-6 bg-blue-500"
                  : "w-2.5 bg-white/60 hover:bg-white"
                  }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
