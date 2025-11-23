// src/components/listing/steps/GeneralInfoStep.tsx

import type { ChangeEvent } from "react";

interface GeneralInfoStepProps {
  values: {
    title: string;
    description: string;
    city: string;
    region: string;
  };
  onChange: (field: string, value: string) => void;
}

export function GeneralInfoStep({ values, onChange }: GeneralInfoStepProps) {
  function handleInput(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    onChange(e.target.name, e.target.value);
  }

  return (
    <div className="space-y-6">
      {/* Titre */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Titre de l’annonce <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={handleInput}
          placeholder="Ex : Appartement 2 chambres à louer"
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Description complète <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleInput}
          placeholder="Décrivez l’annonce en détail…"
          className="w-full p-3 h-32 border rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
          required
        />
      </div>

      {/* Localisation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Ville */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Ville <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={values.city}
            onChange={handleInput}
            placeholder="Casablanca, Marrakech…"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Région */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Région <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="region"
            value={values.region}
            onChange={handleInput}
            placeholder="Grand Casablanca, Rabat-Salé, …"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
}
