interface DetailsStepProps {
  category: string;
  details: Record<string, any>;
  onChange: (partial: Record<string, any>) => void;
}

export function SpecificDetailsStep({ category, details, onChange }: DetailsStepProps) {
  if (!category) return <p className="text-gray-500">Sélectionnez une catégorie</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Détails de l’annonce</h3>

      {/* -------------------- IMMOBILIER -------------------- */}
      {category === "immobilier" && (
        <div className="space-y-4">
          <div>
            <label className="font-medium">Type de bien *</label>
            <input
              type="text"
              className="input"
              placeholder="Appartement, maison, bureau…"
              value={details.property_type || ""}
              onChange={(e) => onChange({ ...details, property_type: e.target.value })}
            />
          </div>

          <div>
            <label className="font-medium">Surface (m²) *</label>
            <input
              type="number"
              className="input"
              placeholder="Ex : 120"
              value={details.surface || ""}
              onChange={(e) => onChange({ ...details, surface: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="font-medium">Nombre de pièces</label>
            <input
              type="number"
              className="input"
              value={details.rooms || ""}
              onChange={(e) => onChange({ ...details, rooms: Number(e.target.value) })}
            />
          </div>
        </div>
      )}

      {/* -------------------- VEHICULE -------------------- */}
      {category === "vehicules" && (
        <div className="space-y-4">
          <div>
            <label className="font-medium">Marque *</label>
            <input
              type="text"
              className="input"
              placeholder="Toyota, Mercedes…"
              value={details.brand_id || ""}
              onChange={(e) => onChange({ ...details, brand_id: e.target.value })}
            />
          </div>

          <div>
            <label className="font-medium">Modèle *</label>
            <input
              type="text"
              className="input"
              placeholder="Model S, Golf 7…"
              value={details.model_id || ""}
              onChange={(e) => onChange({ ...details, model_id: e.target.value })}
            />
          </div>

          <div>
            <label className="font-medium">Année *</label>
            <input
              type="number"
              className="input"
              value={details.year || ""}
              onChange={(e) => onChange({ ...details, year: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="font-medium">Kilométrage *</label>
            <input
              type="number"
              className="input"
              value={details.mileage || ""}
              onChange={(e) => onChange({ ...details, mileage: Number(e.target.value) })}
            />
          </div>
        </div>
      )}

      {/* -------------------- SERVICES -------------------- */}
      {category === "services" && (
        <div className="space-y-4">
          <div>
            <label className="font-medium">Type de service *</label>
            <input
              type="text"
              className="input"
              placeholder="Plomberie, coiffure…"
              value={details.service_type || ""}
              onChange={(e) => onChange({ ...details, service_type: e.target.value })}
            />
          </div>

          <div>
            <label className="font-medium">Expérience</label>
            <input
              type="text"
              className="input"
              placeholder="Débutant / Intermédiaire / Expert"
              value={details.experience_level || ""}
              onChange={(e) => onChange({ ...details, experience_level: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* -------------------- ARTISANAT -------------------- */}
      {category === "artisanat" && (
        <div className="space-y-4">
          <div>
            <label className="font-medium">Type d’artisanat *</label>
            <input
              type="text"
              className="input"
              placeholder="Sculpture, tissage…"
              value={details.craft_type || ""}
              onChange={(e) => onChange({ ...details, craft_type: e.target.value })}
            />
          </div>

          <div>
            <label className="font-medium">Origine</label>
            <input
              type="text"
              className="input"
              value={details.origin || ""}
              onChange={(e) => onChange({ ...details, origin: e.target.value })}
            />
          </div>

          <div>
            <label className="font-medium">Matériau</label>
            <input
              type="text"
              className="input"
              value={details.material || ""}
              onChange={(e) => onChange({ ...details, material: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
