import { X } from "lucide-react";

const APP_STORE_URL = "https://apps.apple.com/fr/app/goodplans/id6757596855";

export function AppStorePopupSimple({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm sm:max-w-md">

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
          aria-label="Fermer"
        >
          <X className="h-5 w-5 text-gray-700" />
        </button>

        <div className="rounded-3xl bg-white p-6 sm:p-7 shadow-2xl text-center">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            GoodPlans est maintenant disponible sur l’App Store !
          </h3>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Téléchargez l’application mobile GoodPlans pour une expérience plus
            rapide, plus fluide et plus pratique.
          </p>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex justify-center transition-transform hover:scale-105"
          >
            <img
              src="/appstore-badge.png"
              alt="Télécharger GoodPlans sur l’App Store"
              className="h-14 sm:h-16 w-auto"
            />
          </a>

          <p className="mt-3 text-[11px] text-slate-400">
            Disponible gratuitement sur l’App Store
          </p>
        </div>
      </div>
    </div>
  );
}
