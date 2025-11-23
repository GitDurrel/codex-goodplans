import { useEffect, useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import type { CarouselItem } from "../../pages/HomePage/types";

interface SponsoredCarouselProps {
  items: CarouselItem[];
}

export function SponsoredCarousel({ items }: SponsoredCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <section className="mb-12">
      <div className="relative rounded-2xl shadow-xl overflow-hidden">
        {items.map((item, index) => (
          <img
            key={item.image}
            src={item.image}
            alt={`${item.title} - ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

        <button
          onClick={prev}
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full text-white transition-colors"
        >
          <ArrowRight className="h-5 w-5 rotate-180" />
        </button>
        <button
          onClick={next}
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full text-white transition-colors"
        >
          <ArrowRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        <div className="relative z-10 py-12 px-6 sm:px-10 md:px-16 max-w-xl">
          <div className="flex items-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            </div>
            <span className="ml-3 text-white/80 font-medium text-xs uppercase tracking-wider">
              {items[currentIndex].sponsoredText || "Sponsorisé"}
            </span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">{items[currentIndex].title}</h2>
          <p className="text-white/90 text-base mb-6 leading-relaxed">
            {items[currentIndex].description}
          </p>

          <a
            href={items[currentIndex].visitUrl || "#"}
            target="_blank"
            rel="noreferrer"
            className="bg-white text-blue-900 px-8 py-3 rounded-full text-base font-bold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
          >
            {items[currentIndex].visitButtonText || "Découvrir"} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
