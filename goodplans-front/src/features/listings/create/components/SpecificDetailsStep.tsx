import { useMemo } from "react";
import {
  Home,
  Car,
  Briefcase,
  Palette,
  Leaf,
  Waves,
  Warehouse,
  Hammer,
  Loader2,
} from "lucide-react";
import {
  useCategories,
  useSubcategories,
  type Category,
  type Subcategory,
} from "../../../categories/apiCategorie";
import {
  useVehicleBrands,
  useVehicleModels,
} from "../../../vehicle/apiVehicleCatalog";

interface DetailsStepProps {
  category: string; // "real_estate" | "vehicle" | "service" | "craft" (ou anciens slugs FR)
  details: Record<string, any>;
  onChange: (partial: Record<string, any>) => void;
}

export function SpecificDetailsStep({
  category,
  details,
  onChange,
}: DetailsStepProps) {
  // 1) On récupère les données brutes
  const {
    data: rawCategories,
    loading: loadingCategories,
  } = useCategories();

  const {
    data: rawSubcategories,
    loading: loadingSubcategories,
  } = useSubcategories();

  // 2) On normalise : jamais null, toujours un tableau
  const categories: Category[] = (rawCategories ?? []) as Category[];
  const allSubcategories: Subcategory[] = (rawSubcategories ?? []) as Subcategory[];

  if (!category) {
    return <p className="text-gray-500">Sélectionnez une catégorie</p>;
  }

  // On supporte les 2 formats de slugs (FR / EN) au cas où :
  const isRealEstate =
    category === "immobilier" || category === "real_estate";
  const isVehicle = category === "vehicules" || category === "vehicle";
  const isService = category === "services" || category === "service";
  const isCraft = category === "artisanat" || category === "craft";

  function handleChange<K extends string>(key: K, value: any) {
    onChange({ [key]: value });
  }

  const loadingTaxonomies = loadingCategories || loadingSubcategories;

  // ---------- Récup catégories racines ----------
  const realEstateCategory = useMemo(
    () =>
      categories.find(
        (c) => c.slug === "real_estate" || c.slug === "immobilier"
      ) ?? null,
    [categories]
  );

  const serviceCategory = useMemo(
    () =>
      categories.find(
        (c) => c.slug === "service" || c.slug === "services"
      ) ?? null,
    [categories]
  );

  const craftCategory = useMemo(
    () =>
      categories.find(
        (c) => c.slug === "craft" || c.slug === "artisanat"
      ) ?? null,
    [categories]
  );

  // ---------- Sous-catégories par catégorie ----------
  const realEstateSubcategories: Subcategory[] = useMemo(() => {
    if (!realEstateCategory) return [];
    return allSubcategories.filter(
      (s) => s.category_id === realEstateCategory.id
    );
  }, [allSubcategories, realEstateCategory]);

  const serviceSubcategories: Subcategory[] = useMemo(() => {
    if (!serviceCategory) return [];
    return allSubcategories.filter(
      (s) => s.category_id === serviceCategory.id
    );
  }, [allSubcategories, serviceCategory]);

  const craftSubcategories: Subcategory[] = useMemo(() => {
    if (!craftCategory) return [];
    return allSubcategories.filter(
      (s) => s.category_id === craftCategory.id
    );
  }, [allSubcategories, craftCategory]);

  // ---------- Catalogues véhicule : marques + modèles ----------

  const {
    data: vehicleBrands = [],
    loading: loadingBrands,
  } = useVehicleBrands();

  const selectedBrandId: string | undefined =
    details.brand_id || undefined;

  const {
    data: vehicleModels = [],
    loading: loadingModels,
  } = useVehicleModels(selectedBrandId);

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-bold">Détails de l’annonce</h3>

      {/* -------------------- IMMOBILIER -------------------- */}
      {isRealEstate && (
        <div className="space-y-4 animate-slideInUp">
          <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <Home className="h-5 w-5 text-blue-600" />
            Bien immobilier
          </h4>

          {/* Type de bien (sous-catégories) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de bien <span className="text-red-500">*</span>
            </label>

            {loadingTaxonomies ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Chargement des types de biens...
              </div>
            ) : realEstateSubcategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {realEstateSubcategories.map((sub) => {
                  const isSelected = details.property_type === sub.slug;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() =>
                        handleChange("property_type", sub.slug)
                      }
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${isSelected
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md"
                        : "border-gray-200 hover:border-blue-400 hover:shadow-sm"
                        }`}
                    >
                      <div
                        className={`p-2 rounded-full ${isSelected ? "bg-blue-100" : "bg-gray-100"
                          }`}
                      >
                        <Home
                          className={`h-5 w-5 ${isSelected ? "text-blue-600" : "text-gray-500"
                            }`}
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-sm">
                          {sub.name}
                        </span>
                        {sub.description && (
                          <span className="text-xs text-gray-500 line-clamp-2">
                            {sub.description}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <input
                type="text"
                className="input"
                placeholder="Appartement, maison, bureau…"
                value={details.property_type || ""}
                onChange={(e) =>
                  handleChange("property_type", e.target.value)
                }
              />
            )}
          </div>

          {/* Surface */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Surface (m²) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="input"
              placeholder="Ex : 120"
              value={details.surface ?? ""}
              onChange={(e) =>
                handleChange(
                  "surface",
                  e.target.value ? Number(e.target.value) : null
                )
              }
              min={0}
            />
          </div>

          {/* Pièces / chambres / salles de bain */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pièces
              </label>
              <input
                type="number"
                className="input"
                value={details.rooms ?? ""}
                onChange={(e) =>
                  handleChange(
                    "rooms",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chambres
              </label>
              <input
                type="number"
                className="input"
                value={details.bedrooms ?? ""}
                onChange={(e) =>
                  handleChange(
                    "bedrooms",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salles de bain
              </label>
              <input
                type="number"
                className="input"
                value={details.bathrooms ?? ""}
                onChange={(e) =>
                  handleChange(
                    "bathrooms",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                min={0}
              />
            </div>
          </div>

          {/* Options : jardin / piscine / garage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                checked={!!details.garden}
                onChange={(e) =>
                  handleChange("garden", e.target.checked)
                }
              />
              <Leaf className="h-4 w-4 text-emerald-500" />
              <span>Jardin</span>
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                checked={!!details.pool}
                onChange={(e) =>
                  handleChange("pool", e.target.checked)
                }
              />
              <Waves className="h-4 w-4 text-sky-500" />
              <span>Piscine</span>
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                checked={!!details.garage}
                onChange={(e) =>
                  handleChange("garage", e.target.checked)
                }
              />
              <Warehouse className="h-4 w-4 text-slate-500" />
              <span>Garage</span>
            </label>
          </div>
        </div>
      )}

      {/* -------------------- VEHICULES -------------------- */}
      {isVehicle && (
        <div className="space-y-4 animate-slideInUp">
          <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <Car className="h-5 w-5 text-blue-600" />
            Véhicule
          </h4>

          {/* Marque */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marque <span className="text-red-500">*</span>
            </label>

            {loadingBrands ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Chargement des marques...
              </div>
            ) : (
              <select
                className="input"
                value={details.brand_id ?? ""}
                onChange={(e) => {
                  const brandId = e.target.value || null;
                  handleChange("brand_id", brandId);
                  // reset modèle si on change de marque
                  handleChange("model_id", null);
                }}
              >
                <option value="">Sélectionnez une marque</option>
                {(vehicleBrands || []).map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Modèle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modèle <span className="text-red-500">*</span>
            </label>

            {!details.brand_id ? (
              <p className="text-xs text-gray-500">
                Sélectionnez d’abord une marque.
              </p>
            ) : loadingModels ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Chargement des modèles...
              </div>
            ) : (
              <select
                className="input"
                value={details.model_id ?? ""}
                onChange={(e) =>
                  handleChange("model_id", e.target.value || null)
                }
              >
                <option value="">Sélectionnez un modèle</option>
                {(vehicleModels ?? []).map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Année <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="input"
                placeholder="Ex : 2018"
                value={details.year ?? ""}
                onChange={(e) =>
                  handleChange(
                    "year",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                min={1900}
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kilométrage (km) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="input"
                placeholder="Ex : 120000"
                value={details.mileage ?? ""}
                onChange={(e) =>
                  handleChange(
                    "mileage",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                min={0}
              />
            </div>
          </div>
        </div>
      )}

      {/* -------------------- SERVICES -------------------- */}
      {isService && (
        <div className="space-y-4 animate-slideInUp">
          <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <Briefcase className="h-5 w-5 text-blue-600" />
            Service
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de service <span className="text-red-500">*</span>
            </label>

            {loadingTaxonomies ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Chargement des types de services...
              </div>
            ) : serviceSubcategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {serviceSubcategories.map((sub) => {
                  const isSelected = details.service_type === sub.slug;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() =>
                        handleChange("service_type", sub.slug)
                      }
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${isSelected
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md"
                        : "border-gray-200 hover:border-blue-400 hover:shadow-sm"
                        }`}
                    >
                      <div
                        className={`p-2 rounded-full ${isSelected ? "bg-blue-100" : "bg-gray-100"
                          }`}
                      >
                        <Briefcase
                          className={`h-5 w-5 ${isSelected ? "text-blue-600" : "text-gray-500"
                            }`}
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-sm">
                          {sub.name}
                        </span>
                        {sub.description && (
                          <span className="text-xs text-gray-500 line-clamp-2">
                            {sub.description}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <input
                type="text"
                className="input"
                placeholder="Plomberie, coiffure, ménage…"
                value={details.service_type || ""}
                onChange={(e) =>
                  handleChange("service_type", e.target.value)
                }
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau d’expérience
            </label>
            <input
              type="text"
              className="input"
              placeholder="Débutant / Intermédiaire / Expert"
              value={details.experience_level || ""}
              onChange={(e) =>
                handleChange("experience_level", e.target.value)
              }
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 pt-2">
            <input
              type="checkbox"
              className="rounded border-gray-300"
              checked={!!details.home_service}
              onChange={(e) =>
                handleChange("home_service", e.target.checked)
              }
            />
            <span>Prestation à domicile</span>
          </label>
        </div>
      )}

      {/* -------------------- ARTISANAT -------------------- */}
      {isCraft && (
        <div className="space-y-4 animate-slideInUp">
          <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <Palette className="h-5 w-5 text-blue-600" />
            Artisanat
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type d’artisanat <span className="text-red-500">*</span>
            </label>

            {loadingTaxonomies ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Chargement des types d’artisanat...
              </div>
            ) : craftSubcategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {craftSubcategories.map((sub) => {
                  const isSelected = details.craft_type === sub.slug;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() =>
                        handleChange("craft_type", sub.slug)
                      }
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${isSelected
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md"
                        : "border-gray-200 hover:border-blue-400 hover:shadow-sm"
                        }`}
                    >
                      <div
                        className={`p-2 rounded-full ${isSelected ? "bg-blue-100" : "bg-gray-100"
                          }`}
                      >
                        <Palette
                          className={`h-5 w-5 ${isSelected ? "text-blue-600" : "text-gray-500"
                            }`}
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-sm">
                          {sub.name}
                        </span>
                        {sub.description && (
                          <span className="text-xs text-gray-500 line-clamp-2">
                            {sub.description}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <input
                type="text"
                className="input"
                placeholder="Sculpture, tissage, poterie…"
                value={details.craft_type || ""}
                onChange={(e) =>
                  handleChange("craft_type", e.target.value)
                }
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origine
              </label>
              <input
                type="text"
                className="input"
                placeholder="Ex : Cameroun, Maroc…"
                value={details.origin || ""}
                onChange={(e) =>
                  handleChange("origin", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matériau
              </label>
              <input
                type="text"
                className="input"
                placeholder="Bois, cuir, métal…"
                value={details.material || ""}
                onChange={(e) =>
                  handleChange("material", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                checked={!!details.handmade}
                onChange={(e) =>
                  handleChange("handmade", e.target.checked)
                }
              />
              <Hammer className="h-4 w-4 text-amber-500" />
              <span>Fait main</span>
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                checked={!!details.authentic}
                onChange={(e) =>
                  handleChange("authentic", e.target.checked)
                }
              />
              <span>Authentique</span>
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                checked={!!details.vintage}
                onChange={(e) =>
                  handleChange("vintage", e.target.checked)
                }
              />
              <span>Vintage / ancien</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dimensions (optionnel)
            </label>
            <input
              type="text"
              className="input"
              placeholder="Ex : 120x60x75 cm"
              value={details.dimensions || ""}
              onChange={(e) =>
                handleChange("dimensions", e.target.value)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
