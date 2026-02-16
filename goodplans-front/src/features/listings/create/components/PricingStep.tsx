// src/components/listing/steps/PricingStep.tsx

import { useEffect, useState } from "react";
import { DollarSign, Clock, AlertCircle } from "lucide-react";

interface PricingStepProps {
  values: {
    price: string;
    transaction_type: string; // "achat" | "location" | ""
  rental_period: string;    // "day" | "week" | "month" | "year" | ""
  minimum_rental_period?: string;
  availability_date?: string;
  };
  onChange: (partial: Record<string, any>) => void;
  category: string;
}

export function PricingStep({ values, onChange }: PricingStepProps) {
  const isRental = values.transaction_type === "location";

  const [showPriceError, setShowPriceError] = useState(false);
  const [showRentalPeriodError, setShowRentalPeriodError] = useState(false);

  useEffect(() => {
    const priceNumber = Number(values.price);
    const isPriceValid = !!values.price && !isNaN(priceNumber) && priceNumber > 0;
    setShowPriceError(!isPriceValid);

    if (isRental) {
      const isRentalPeriodValid = !!values.rental_period;
      setShowRentalPeriodError(!isRentalPeriodValid);
    } else {
      setShowRentalPeriodError(false);
    }
  }, [values.price, values.rental_period, isRental]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
          Tarification
        </h3>

        <div className="mt-4 space-y-6">
          {/* ---- TYPE DE TRANSACTION ---- */}
          <div>
            <label className="block font-semibold mb-2">
              Type de transaction <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {["achat", "location"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    onChange({
                      transaction_type: type,
                      // si on passe de location -> achat, on peut garder rental_period,
                      // mais c'est pas grave si on le laisse, il ne sera pas utilisé
                    })
                  }
                  className={`flex-1 px-4 py-3 rounded-lg border text-center font-medium transition ${
                    values.transaction_type === type
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {type === "achat" ? "À vendre" : "À louer"}
                </button>
              ))}
            </div>
          </div>

          {/* ---- PRIX ---- */}
          <div>
            <label className="block font-semibold mb-2">
              {isRental ? "Prix de location" : "Prix"}{" "}
              <span className="text-red-500">*</span>
            </label>

            <div className="relative">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <span className="text-gray-400 text-sm font-medium">MAD</span>
  </div>
  <input
  type="text"  // ✅ Changé de "number" à "text"
  inputMode="numeric"  // ✅ Affiche le clavier numérique sur mobile
  pattern="[0-9]*"  // ✅ Validation HTML5
  className="w-full pl-16 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  placeholder={isRental ? "Ex : 5000 (par période)" : "Ex : 250000"}
  value={values.price}
  onChange={(e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // ✅ Garde uniquement les chiffres
    onChange({ price: value });
  }}
/>
</div>

            {showPriceError && (
              <div className="mt-2 bg-red-100 text-red-800 text-sm font-medium px-3 py-2 rounded-md flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <span>Le prix est obligatoire et doit être supérieur à 0.</span>
              </div>
            )}
          </div>

          {/* ---- LOCATION: PERIODE DE LOCATION ---- */}
          {isRental && (
            <div>
              <label className="block font-semibold mb-2">
                Période de location <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "day", label: "Jour" },
                  { id: "week", label: "Semaine" },
                  { id: "month", label: "Mois" },
                  { id: "year", label: "An" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        rental_period: p.id,
                      })
                    }
                    className={`px-4 py-3 rounded-lg border font-medium transition ${
                      values.rental_period === p.id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-gray-300 text-gray-700"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {showRentalPeriodError && (
                <div className="mt-2 bg-red-100 text-red-800 text-sm font-medium px-3 py-2 rounded-md flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5" />
                  <span>La période de location est obligatoire.</span>
                </div>
              )}
            </div>
          )}

          {/* ---- CONSEILS TARIFICATION ---- */}
          <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 mb-1">
                  Conseils de tarification
                </h4>
                <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
                  <li>
                    Comparez avec des annonces similaires dans votre ville / région.
                  </li>
                  <li>
                    Prenez en compte l’état, l’ancienneté et la rareté de votre bien.
                  </li>
                  <li>
                    Un prix légèrement en dessous du marché peut accélérer la vente.
                  </li>
                  <li>
                    Pensez aux frais de déplacement / livraison si applicable.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
