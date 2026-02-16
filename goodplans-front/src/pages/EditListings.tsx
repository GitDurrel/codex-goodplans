import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, X, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../features/auth/AuthContext";
import {
  fetchListingById,
  updateRealEstateListing,
  updateVehicleListing,
  updateServiceListing,
  updateCraftListing,
  uploadListingImages,
} from "../features/listings/apiListings";
import type { Listing } from "../features/listings/types";
import { SpecificDetailsStep } from "../features/listings/create/components/SpecificDetailsStep";
import { useLanguage } from "../lib/language/LanguageContext";

type EditBaseState = {
  title: string;
  description: string;
  price: number;
  city: string;
  region: string;
  transaction_type: string | null;
  images: string[];
};

export function EditListingPage() {

const { t } = useLanguage();

  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [base, setBase] = useState<EditBaseState>({
    title: "",
    description: "",
    price: 0,
    city: "",
    region: "",
    transaction_type: null,
    images: [],
  });
  const [category, setCategory] = useState<string>("");
  const [details, setDetails] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newImages, setNewImages] = useState<File[]>([]); // <- ajouts d’images

  // ----------------- LOAD -----------------
  useEffect(() => {
    const load = async () => {
      if (!listingId) return;
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const data = await fetchListingById(listingId);

        setListing(data);
        setCategory(data.category);

        setBase({
          title: data.title ?? "",
          description: data.description ?? "",
          price: data.price ?? 0,
          city: data.city ?? "",
          region: data.region ?? "",
          transaction_type: (data as any).transaction_type ?? null,
          images: (data.images as string[]) ?? [],
        });

        setDetails(buildInitialDetails(data));
      } catch (e) {
        console.error("Erreur chargement annonce", e);
        toast.error(t("editListing.errors.loadError"));
        navigate("/seller/listings");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [listingId, user, navigate]);

  // ----------------- HELPERS -----------------

  const normalizedCategory = useMemo(() => {
    if (category === "immobilier") return "real_estate";
    if (category === "vehicules" || category === "auto-moto") return "vehicle";
    if (category === "services") return "service";
    if (category === "deco-artisanat" || category === "artisanat") return "craft";
    return category;
  }, [category]);

  function handleBaseChange<K extends keyof EditBaseState>(
    key: K,
    value: EditBaseState[K],
  ) {
    setBase((prev) => ({ ...prev, [key]: value }));
  }

  function handleDetailsChange(partial: Record<string, any>) {
    setDetails((prev) => ({ ...prev, ...partial }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!base.title.trim()) newErrors.title = t("editListing.validation.titleRequired");
    if (!base.description.trim()) newErrors.description = t("editListing.validation.descriptionRequired");
    if (!base.price || base.price <= 0) newErrors.price = t("editListing.validation.invalidPrice");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ----------------- SUBMIT -----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingId) return;

    if (!validate()) {
      toast.error(t("editListing.errors.validationFix"));
      return;
    }

    setSaving(true);
    try {
      // 1) upload des nouvelles images si besoin
      let finalImages = base.images;
      if (newImages.length > 0) {
        const { urls } = await uploadListingImages(newImages);
        finalImages = [...finalImages, ...urls];
      }

      const common = {
        title: base.title.trim(),
        description: base.description.trim(),
        price: base.price,
        city: base.city.trim(),
        region: base.region.trim(),
        transaction_type: base.transaction_type,
        images: finalImages,
      };

      switch (normalizedCategory) {
        case "real_estate": {
          await updateRealEstateListing(listingId, {
            ...common,
            property_type: details.property_type ?? null,
            surface: details.surface ?? null,
            rooms: details.rooms ?? null,
            bedrooms: details.bedrooms ?? null,
            bathrooms: details.bathrooms ?? null,
            furnished: !!details.furnished,
            garden: !!details.garden,
            pool: !!details.pool,
            garage: !!details.garage,
            rental_start_date: details.rental_start_date ?? null,
            rental_end_date: details.rental_end_date ?? null,
            rental_duration: details.rental_duration ?? null,
            rental_period: details.rental_period ?? null,
          });
          break;
        }

        case "vehicle": {
          await updateVehicleListing(listingId, {
            ...common,
            brand_id: details.brand_id ?? null,
            model_id: details.model_id ?? null,
            year: details.year ?? null,
            mileage: details.mileage ?? null,
          });
          break;
        }

        case "service": {
          await updateServiceListing(listingId, {
            ...common,
            service_type: details.service_type ?? null,
            experience_level: details.experience_level ?? null,
            home_service: !!details.home_service,
            rental_start_date: details.rental_start_date ?? null,
            rental_end_date: details.rental_end_date ?? null,
            rental_duration: details.rental_duration ?? null,
            rental_period: details.rental_period ?? null,
          });
          break;
        }

        case "craft": {
          await updateCraftListing(listingId, {
            ...common,
            craft_type: details.craft_type ?? null,
            origin: details.origin ?? null,
            material: details.material ?? null,
            handmade: !!details.handmade,
            authentic: !!details.authentic,
            vintage: !!details.vintage,
            dimensions: details.dimensions ?? null,
          });
          break;
        }

        default:
          toast.error(t("editListing.errors.unsupportedCategory"));
          setSaving(false);
          return;
      }

      toast.success(t("editListing.success.updated"));
      navigate("/seller/listings");
    } catch (err) {
      console.error(err);
      toast.error(t("editListing.errors.updateError"));
    } finally {
      setSaving(false);
    }
  };

  // ----------------- RENDER -----------------

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
        <p className="text-red-500 text-lg">
          {t("editListing.errors.notFound")}
        </p>
        <button
          onClick={() => navigate("/seller/listings")}
          className="mt-4 px-4 py-2 text-sm rounded-md bg-primary text-white"
        >
          {t("editListing.navigation.backToListings")}
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
    >
      <button
        onClick={() => navigate("/seller/listings")}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t("editListing.navigation.backToListings")}
      </button>

      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {t("editListing.header.title")}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {t("editListing.header.category")} <span className="font-medium">{category}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Infos générales */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {t("editListing.sections.generalInfo")}
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("editListing.fields.title")}
              </label>
              <input
                type="text"
                className={`input ${errors.title ? "border-red-300" : ""}`}
                value={base.title}
                onChange={(e) => handleBaseChange("title", e.target.value)}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("editListing.fields.description")}
              </label>
              <textarea
                className={`input min-h-[90px] ${
                  errors.description ? "border-red-300" : ""
                }`}
                value={base.description}
                onChange={(e) =>
                  handleBaseChange("description", e.target.value)
                }
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("editListing.fields.price")}
                </label>
                <input
                  type="number"
                  className={`input ${errors.price ? "border-red-300" : ""}`}
                  min={0}
                  value={base.price}
                  onChange={(e) =>
                    handleBaseChange("price", Number(e.target.value) || 0)
                  }
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("editListing.fields.city")}
                </label>
                <input
                  type="text"
                  className="input"
                  value={base.city}
                  onChange={(e) => handleBaseChange("city", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("editListing.fields.region")}
                </label>
                <input
                  type="text"
                  className="input"
                  value={base.region}
                  onChange={(e) => handleBaseChange("region", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Détails spécifiques */}
          <section>
            <SpecificDetailsStep
              category={normalizedCategory}
              details={details}
              onChange={handleDetailsChange}
            />
          </section>

          {/* Images */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800">{t("editListing.sections.images")}</h2>
            {base.images.length === 0 && (
              <p className="text-sm text-gray-500">
                {t("editListing.images.none")}
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {base.images.map((url, idx) => (
                <div key={url} className="relative">
                  <img
                    src={url}
                    alt=""
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleBaseChange(
                        "images",
                        base.images.filter((_, i) => i !== idx),
                      )
                    }
                    className="absolute top-1 right-1 px-2 py-1 text-xs rounded bg-white/90 text-red-600 border border-red-200"
                  >
                    {t("editListing.images.delete")}
                  </button>
                </div>
              ))}
            </div>

            {/* Ajout de nouvelles images */}
            <div className="mt-3 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("editListing.images.addNew")}
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setNewImages(
                    e.target.files ? Array.from(e.target.files) : [],
                  )
                }
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary/90
                "
              />
              {newImages.length > 0 && (
                <p className="text-xs text-gray-500">
                  {newImages.length} {t("editListing.images.selectedCount")}
                </p>
              )}
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/seller/listings")}
              className="btn-secondary"
            >
              <X className="h-4 w-4 inline-block mr-1" />
              {t("editListing.buttons.cancel")}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              <Save className="h-4 w-4 inline-block mr-1" />
              {saving ? t("editListing.buttons.saving") : t("editListing.buttons.save")}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

/**
 * Construit l’objet "details" initial à partir du listing retourné par l’API.
 * On supporte real_estate, vehicle, service, craft, avec les 2 formes :
 *  - { realEstate, vehicle, service, craft }
 *  - { real_estate_listings: [ ... ], vehicle_listings: [ ... ], ... }
 */
function buildInitialDetails(listing: Listing): Record<string, any> {
  const cat = listing.category;
  const anyListing = listing as any;

  const realEstate =
    anyListing.realEstate ??
    anyListing.real_estate ??
    (anyListing.real_estate_listings?.[0] ?? null);

  const vehicle =
    anyListing.vehicle ??
    anyListing.vehicleDetails ??
    (anyListing.vehicle_listings?.[0] ?? null);

  const service =
    anyListing.service ??
    anyListing.serviceDetails ??
    (anyListing.service_listings?.[0] ?? null);

  const craft =
    anyListing.craft ??
    anyListing.craftDetails ??
    (anyListing.craft_listings?.[0] ?? null);

  if (cat === "real_estate" || cat === "immobilier") {
    return {
      property_type: realEstate?.property_type ?? listing.subcategory ?? "",
      surface: realEstate?.surface ?? null,
      rooms: realEstate?.rooms ?? null,
      bedrooms: realEstate?.bedrooms ?? null,
      bathrooms: realEstate?.bathrooms ?? null,
      furnished: realEstate?.furnished ?? false,
      garden: realEstate?.garden ?? false,
      pool: realEstate?.pool ?? false,
      garage: realEstate?.garage ?? false,
      rental_start_date: realEstate?.rental_start_date ?? null,
      rental_end_date: realEstate?.rental_end_date ?? null,
      rental_duration: realEstate?.rental_duration ?? null,
      rental_period:
        realEstate?.rental_period ?? anyListing.rental_period ?? null,
    };
  }

  if (cat === "vehicle" || cat === "vehicules" || cat === "auto-moto") {
    return {
      brand_id: vehicle?.brand_id ?? null,
      model_id: vehicle?.model_id ?? null,
      year: vehicle?.year ?? null,
      mileage: vehicle?.mileage ?? null,
    };
  }

  if (cat === "service" || cat === "services") {
    return {
      service_type: service?.service_type ?? listing.subcategory ?? "",
      experience_level: service?.experience_level ?? "",
      home_service: service?.home_service ?? false,
      rental_start_date: service?.rental_start_date ?? null,
      rental_end_date: service?.rental_end_date ?? null,
      rental_duration: service?.rental_duration ?? null,
      rental_period:
        service?.rental_period ?? anyListing.rental_period ?? null,
    };
  }

  if (cat === "craft" || cat === "deco-artisanat" || cat === "artisanat") {
    return {
      craft_type: craft?.craft_type ?? listing.subcategory ?? "",
      origin: craft?.origin ?? "",
      material: craft?.material ?? "",
      handmade: craft?.handmade ?? false,
      authentic: craft?.authentic ?? false,
      vintage: craft?.vintage ?? false,
      dimensions: craft?.dimensions ?? "",
    };
  }

  return {};
}
