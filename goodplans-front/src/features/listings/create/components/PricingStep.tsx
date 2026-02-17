import { useEffect, useState } from "react";
import { DollarSign, Clock, AlertCircle } from "lucide-react";
import { useLanguage } from "../../../../lib/language/LanguageContext";

interface PricingStepProps {
  values: {
    price: string;
    transaction_type: string;
    rental_period: string;
    minimum_rental_period?: string;
    availability_date?: string;
  };
  onChange: (partial: Record<string, any>) => void;
  category: string;
}

export function PricingStep({ values, onChange }: PricingStepProps) {
  const isRental = values.transaction_type === "location";
  const { t } = useLanguage();

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
          {t("createListing.pricing.title")}
        </h3>

        <div className="mt-4 space-y-6">
          <div>
            <label className="block font-semibold mb-2">
              {t("createListing.pricing.transactionType")} <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {["achat", "location"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChange({ transaction_type: type })}
                  className={`flex-1 px-4 py-3 rounded-lg border text-center font-medium transition ${
                    values.transaction_type === type
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {type === "achat" ? t("createListing.pricing.forSale") : t("createListing.pricing.forRent")}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              {isRental ? t("createListing.pricing.rentalPrice") : t("createListing.pricing.price")}{" "}
              <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-sm font-medium">MAD</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full pl-16 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder={isRental ? t("createListing.pricing.rentalPricePlaceholder") : t("createListing.pricing.pricePlaceholder")}
                value={values.price}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  onChange({ price: value });
                }}
              />
            </div>

            {showPriceError && (
              <div className="mt-2 bg-red-100 text-red-800 text-sm font-medium px-3 py-2 rounded-md flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <span>{t("createListing.pricing.priceError")}</span>
              </div>
            )}
          </div>

          {isRental && (
            <div>
              <label className="block font-semibold mb-2">
                {t("createListing.pricing.rentalPeriod")} <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "day", label: t("listing.rentalPeriod.day") },
                  { id: "week", label: t("listing.rentalPeriod.week") },
                  { id: "month", label: t("listing.rentalPeriod.month") },
                  { id: "year", label: t("listing.rentalPeriod.year") },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onChange({ rental_period: p.id })}
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
                  <span>{t("createListing.pricing.rentalPeriodError")}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">{t("createListing.pricing.tipsTitle")}</h4>
                <p className="text-sm text-yellow-700 mt-1">{t("createListing.pricing.tipsDescription")}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
            <div className="flex items-center gap-2 font-medium">
              <DollarSign className="h-4 w-4" />
              {t("createListing.pricing.noteTitle")}
            </div>
            <p className="mt-1">{t("createListing.pricing.noteDescription")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
