import { Calendar, DollarSign, Clock } from "lucide-react";

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

  return (
    <div className="space-y-6">
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
                onChange({ transaction_type: type })
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
          Prix <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <DollarSign className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
          <input
            type="number"
            className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: 250000"
            value={values.price}
            onChange={(e) => onChange({ price: e.target.value })}
          />
        </div>
      </div>

      {/* ---- LOCATION: PERIODE DE LOCATION ---- */}
      {isRental && (
        <>
          <div>
            <label className="block font-semibold mb-2">
              Période de location
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
                    onChange({ rental_period: p.id })
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
          </div>

          {/* ---- MINIMUM RENTAL PERIOD ---- */}
          <div>
            <label className="block font-semibold mb-2">
              Durée minimum de location
            </label>

            <div className="relative">
              <Clock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input
                type="number"
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: 3"
                value={values.minimum_rental_period || ""}
                onChange={(e) => onChange({ minimum_rental_period: e.target.value })}
              />
            </div>
          </div>

          {/* ---- AVAILABILITY DATE ---- */}
          <div>
            <label className="block font-semibold mb-2">
              Date de disponibilité
            </label>

            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-500 w-5 h-5" />

              <input
                type="date"
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                value={values.availability_date || ""}
                onChange={(e) => onChange({ availability_date: e.target.value })}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
