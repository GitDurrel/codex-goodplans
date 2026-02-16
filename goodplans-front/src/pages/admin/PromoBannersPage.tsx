import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Plus, Trash2, Edit3, Check, X } from "lucide-react";
import { toast } from "react-hot-toast";

import {
  type PromoBanner,
  apiGetPromoBanners,
  apiCreatePromoBanner,
  apiUpdatePromoBanner,
  apiDeletePromoBanner,
  type CreatePromoBannerPayload,
  apiUploadPromoBannerImages,
  type AdvertisingRequest,
  apiAdminGetAdvertisingRequest,
  apiAdminUpdateAdvertisingRequestStatus,
} from "../../features/admin/adminApi";

type FormMode = "create" | "edit";

const emptyPlacements = {
  topOfPage: false,
  popup: false,
  carousel: false,
  searchPage: false,
};

const emptyForm: CreatePromoBannerPayload = {
  title: "",
  description: "",
  image_desktop: "",
  image_mobile: "",
  link_url: "",
  is_active: true,
  start_date: null,
  end_date: null,
  position: null,
  placements: { ...emptyPlacements },
};

/* -------------------- Taille images (intervalle + tolérance) -------------------- */
const SIZE_RULES = {
  desktop: { minW: 1200, maxW: 2000, minH: 400, maxH: 1024, tolerance: 20 },
  mobile: { minW: 600, maxW: 1200, minH: 600, maxH: 1200, tolerance: 20 },
} as const;

function inRangeWithTolerance(value: number, min: number, max: number, tol: number) {
  return value >= min - tol && value <= max + tol;
}

function readImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      URL.revokeObjectURL(url);
      resolve({ width, height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Impossible de lire l'image"));
    };
    img.src = url;
  });
}

/* -------------------- Helpers dates (safe timezone) -------------------- */
function toLocalDateOnly(dateStr: string) {
  // "YYYY-MM-DDTHH:mm:ss..." => on garde la date locale
  if (dateStr.includes("T")) {
    const d = new Date(dateStr);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  // "YYYY-MM-DD"
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function parsePlacements(p: any): Record<string, boolean> {
  if (!p) return {};
  if (typeof p === "string") {
    try {
      return JSON.parse(p);
    } catch {
      return {};
    }
  }
  return p;
}

export default function PromoBannersPage() {
  const [searchParams] = useSearchParams();
  const fromRequestId = searchParams.get("fromRequest");

  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<CreatePromoBannerPayload>(emptyForm);
  const [mode, setMode] = useState<FormMode>("create");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [uploading, setUploading] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<PromoBanner | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* -------------------- Actif / expiré (pour griser les slots) -------------------- */
  function isBannerCurrentlyActive(b: PromoBanner) {
    if (!b.is_active) return false;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const start = b.start_date ? toLocalDateOnly(b.start_date) : null;
    const end = b.end_date ? toLocalDateOnly(b.end_date) : null;

    if (start && today < start) return false; // pas encore commencé
    if (end && today > end) return false;     // expiré

    return true;
  }

  function isPlacementTaken(placement: keyof typeof emptyPlacements) {
    return banners.some((b) => {
      // Ne pas compter le banner qu'on édite
      if (selectedId && b.id === selectedId) return false;

      const placements = parsePlacements((b as any).placements);
      return !!placements?.[placement] && isBannerCurrentlyActive(b);
    });
  }

  const topTaken = isPlacementTaken("topOfPage");
  const searchTaken = isPlacementTaken("searchPage");
  const popupTaken = isPlacementTaken("popup");

  /* -------------------- LOAD -------------------- */
  async function load() {
    try {
      setLoading(true);
      const data = await apiGetPromoBanners();
      setBanners(data);

      // ne pas écraser le form si on vient d'un devis
      if (!selectedId && !fromRequestId) {
        setForm(emptyForm);
        setMode("create");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Erreur lors du chargement des encarts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------- Pré-remplissage devis -------------------- */
  useEffect(() => {
    async function prefillFromRequest(id: string) {
      try {
        const req: AdvertisingRequest = await apiAdminGetAdvertisingRequest(id);

        const adSpace = (req.ad_space || {}) as {
          topOfPage?: boolean;
          popup?: boolean;
          carousel?: boolean;
          searchPage?: boolean;
        };

        setMode("create");
        setSelectedId(null);
        setForm({
          ...emptyForm,
          title: `Encart pour ${req.company}`,
          description: `Campagne demandée par ${req.name} (${req.company}) – durée souhaitée : ${req.duration}`,
          placements: {
            topOfPage: !!adSpace.topOfPage,
            popup: !!adSpace.popup,
            carousel: !!adSpace.carousel,
            searchPage: !!adSpace.searchPage,
          },
        });
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message || "Impossible de pré-remplir l’encart depuis ce devis");
      }
    }

    if (fromRequestId) void prefillFromRequest(fromRequestId);
  }, [fromRequestId]);

  /* -------------------- Handlers form -------------------- */
  function handleSelect(banner: PromoBanner) {
    setSelectedId(banner.id);
    setMode("edit");

    const placements = parsePlacements((banner as any).placements);

    setForm({
      title: banner.title,
      description: banner.description ?? "",
      image_desktop: banner.image_desktop || "",
      image_mobile: banner.image_mobile || "",
      link_url: banner.link_url ?? "",
      is_active: banner.is_active,
      start_date: banner.start_date ? banner.start_date.slice(0, 10) : null,
      end_date: banner.end_date ? banner.end_date.slice(0, 10) : null,
      position: banner.position ?? null,
      placements: {
        topOfPage: !!placements.topOfPage,
        popup: !!placements.popup,
        carousel: !!placements.carousel,
        searchPage: !!placements.searchPage,
      },
    });
  }

  function resetToCreate() {
    setSelectedId(null);
    setMode("create");
    setForm(emptyForm);
  }

  function handleChange<K extends keyof CreatePromoBannerPayload>(key: K, value: CreatePromoBannerPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handlePlacementsChange(name: keyof typeof emptyPlacements, value: boolean) {
    setForm((prev) => ({
      ...prev,
      placements: {
        ...(prev.placements || { ...emptyPlacements }),
        [name]: value,
      },
    }));
  }

  /* -------------------- Carousel capacity -------------------- */
  const carouselActive = banners.filter((b) => {
    const placements = parsePlacements((b as any).placements);
    return !!placements.carousel && isBannerCurrentlyActive(b);
  }).length;

  const carouselRemaining = 5 - carouselActive;

  /* -------------------- Upload image + validation -------------------- */
  async function handleSingleUpload(e: React.ChangeEvent<HTMLInputElement>, type: "desktop" | "mobile") {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    try {
      // 1) validate dimensions (AVANT upload)
      const rule = SIZE_RULES[type];
      const { width, height } = await readImageSize(file);

      const okW = inRangeWithTolerance(width, rule.minW, rule.maxW, rule.tolerance);
      const okH = inRangeWithTolerance(height, rule.minH, rule.maxH, rule.tolerance);

      if (!(okW && okH)) {
        toast.error(
          `Image non adaptée (${width}×${height}). ` +
            (type === "desktop"
              ? "Desktop: largeur ~1200–2000px et hauteur ~400–1024px."
              : "Mobile: largeur ~600–1200px et hauteur ~600–1200px.")
        );
        e.target.value = "";
        return;
      }

      // 2) upload
      setUploading(true);
      const res = await apiUploadPromoBannerImages([file]);
      const url = res.urls?.[0];

      if (!url) {
        toast.error("Upload impossible : URL introuvable.");
        return;
      }

      setForm((prev) => ({
        ...prev,
        [type === "desktop" ? "image_desktop" : "image_mobile"]: url,
      }));

      toast.success(`Image ${type} chargée`);
    } catch (err: any) {
      console.error(err);

      if (err?.message?.includes("Impossible de lire")) {
        toast.error("Impossible de lire l’image. Essaie une autre image.");
        return;
      }

      const backendMsg =
        err?.response?.data?.message ||
        err?.data?.message ||
        err?.message;

      toast.error(backendMsg || "Upload impossible. Réessaie plus tard.");
    } finally {
      setUploading(false);
    }
  }

  /* -------------------- Save -------------------- */
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Le titre est obligatoire");
      return;
    }

    if (!form.image_desktop) {
      toast.error("L'image Desktop est requise");
      return;
    }

    // Dates validation (pas passé + end > start)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const start = form.start_date ? toLocalDateOnly(form.start_date) : null;
    const end = form.end_date ? toLocalDateOnly(form.end_date) : null;

    if (start && start < today) {
      toast.error("La date de début ne peut pas être dans le passé.");
      return;
    }

    if (end && end < today) {
      toast.error("La date de fin ne peut pas être dans le passé.");
      return;
    }

    if (start && end && end <= start) {
      toast.error("La date de fin doit être supérieure à la date de début.");
      return;
    }

    // Uniques slots : top/search/popup => bloqués si déjà pris (en create)
    // (en edit: si c’est déjà coché sur le banner, on autorise)
    if (topTaken && !form.placements?.topOfPage) {
      // ok: checkbox déjà disabled, mais double sécurité
    }
    if (searchTaken && !form.placements?.searchPage) {
      // idem
    }
    if (popupTaken && !form.placements?.popup) {
      // idem
    }

    // Carousel capacity (5 max)
    const currentlyEditingBanner = selectedId ? banners.find((b) => b.id === selectedId) : null;
    const currentPlacements = currentlyEditingBanner ? parsePlacements((currentlyEditingBanner as any).placements) : {};
    const wasAlreadyInCarousel = !!currentPlacements.carousel;
    const isNewCarouselSlot = !!form.placements?.carousel && (mode === "create" || !wasAlreadyInCarousel);

    if (isNewCarouselSlot && carouselRemaining <= 0) {
      toast.error("Le carrousel est plein (5/5). Impossible d’ajouter un nouvel encart.");
      return;
    }

    const payload: CreatePromoBannerPayload = {
      ...form,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      position: form.position === null || form.position === undefined ? null : Number(form.position),
      placements: form.placements || { ...emptyPlacements },
    };

    try {
      setSaving(true);

      if (mode === "create") {
        await apiCreatePromoBanner(payload);
        toast.success("Encart publicitaire créé");

        if (fromRequestId) {
          try {
            await apiAdminUpdateAdvertisingRequestStatus(fromRequestId, "replied");
          } catch (err) {
            console.error(err);
          }
        }
      } else if (mode === "edit" && selectedId) {
        await apiUpdatePromoBanner(selectedId, payload);
        toast.success("Encart publicitaire mis à jour");
      }

      await load();
      if (mode === "create") setForm(emptyForm);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Erreur lors de l’enregistrement");
    } finally {
      setSaving(false);
    }
  }

  /* -------------------- Delete -------------------- */
  async function deleteBanner(id: string) {
    try {
      setDeleting(true);
      await apiDeletePromoBanner(id as any);
      toast.success("Encart supprimé");
      if (selectedId === id) resetToCreate();
      await load();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Erreur lors de la suppression");
    } finally {
      setDeleting(false);
      setBannerToDelete(null);
    }
  }

  /* -------------------- Filtre liste -------------------- */
  const filteredBanners = useMemo(() => {
    if (statusFilter === "all") return banners;
    if (statusFilter === "active") return banners.filter((b) => b.is_active);
    return banners.filter((b) => !b.is_active);
  }, [banners, statusFilter]);

  /* -------------------- RENDER -------------------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Encarts publicitaires</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les bannières affichées dans le carrousel / zones pub du site.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            className="rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">Tous</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>

          <button onClick={load} className="px-3 py-2 rounded-md text-sm bg-gray-100 hover:bg-gray-200 text-gray-700">
            Actualiser
          </button>

          <button
            onClick={resetToCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            <Plus className="h-4 w-4" />
            Nouvel encart
          </button>
        </div>
      </div>

      {/* Contenu principal: liste + formulaire */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Liste des encarts */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredBanners.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Aucun encart trouvé.</div>
          ) : (
            <div className="divide-y">
              {filteredBanners.map((banner) => (
                <div
                  key={banner.id}
                  className={`flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                    selectedId === banner.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleSelect(banner)}
                >
                  <div className="w-16 h-12 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                    {banner.image_desktop ? (
                      <img src={banner.image_desktop} alt={banner.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        Aucune image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">{banner.title}</p>
                      {banner.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-800">
                          <Check className="h-3 w-3" /> Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
                          <X className="h-3 w-3" /> Inactif
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                      {banner.description || "Aucune description"}
                    </p>

                    <p className="mt-1 text-[11px] text-gray-400">
                      {banner.start_date ? `Du ${new Date(banner.start_date).toLocaleDateString("fr-FR")}` : "Sans date de début"} –{" "}
                      {banner.end_date ? `au ${new Date(banner.end_date).toLocaleDateString("fr-FR")}` : "Sans date de fin"}
                      {banner.position !== null && banner.position !== undefined && ` · Position ${banner.position}`}
                    </p>
                  </div>

                  <button
                    className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(banner);
                    }}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>

                  <button
                    className="p-1.5 rounded-full hover:bg-red-50 text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBannerToDelete(banner);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            {mode === "create" ? "Créer un encart publicitaire" : "Modifier l’encart"}
          </h2>

          <p className="text-xs text-gray-500 mb-4">
            Renseigne le titre, au moins une image et les emplacements d’affichage.
          </p>

          <form className="space-y-6" onSubmit={handleSave}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Titre *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="mt-1 block w-full rounded-md border border-blue-100 shadow-sm text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-50 transition px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={form.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border border-blue-100 shadow-sm text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-50 transition px-3 py-2"
              />
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Desktop (1200–2000 × 400–1024) *
                </label>
                <p className="text-[11px] text-gray-500">Tolérance ±20px sur les bornes.</p>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => handleSingleUpload(e, "desktop")}
                  className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-60"
                />
                {form.image_desktop && (
                  <div className="mt-2 relative aspect-[3/1] w-full overflow-hidden rounded-md bg-gray-100">
                    <img src={form.image_desktop} className="h-full w-full object-cover" alt="Preview Desktop" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Mobile (600–1200 × 600–1200)
                </label>
                <p className="text-[11px] text-gray-500">Tolérance ±20px sur les bornes.</p>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => handleSingleUpload(e, "mobile")}
                  className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-60"
                />
                {form.image_mobile && (
                  <div className="mt-2 relative aspect-square w-28 sm:w-36 overflow-hidden rounded-md bg-gray-100">
                    <img src={form.image_mobile} className="h-full w-full object-cover" alt="Preview Mobile" />
                  </div>
                )}
              </div>
            </div>

            {/* Lien */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Lien de redirection</label>
              <input
                type="url"
                value={form.link_url || ""}
                onChange={(e) => handleChange("link_url", e.target.value)}
                placeholder="https://..."
                className="w-full rounded-md border border-blue-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-50 transition-shadow px-3 py-2 shadow-sm"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Date de début</label>
                <input
                  type="date"
                  value={form.start_date || ""}
                  onChange={(e) => handleChange("start_date", e.target.value ? e.target.value : null)}
                  className="mt-1 block w-full rounded-md border border-blue-100 shadow-sm text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-50 transition px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Date de fin</label>
                <input
                  type="date"
                  value={form.end_date || ""}
                  onChange={(e) => handleChange("end_date", e.target.value ? e.target.value : null)}
                  className="mt-1 block w-full rounded-md border border-blue-100 shadow-sm text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-50 transition px-3 py-2"
                />
              </div>
            </div>

            {form.placements?.carousel && (
              <p className="text-xs text-gray-600">
                Places restantes dans le carrousel : <b>{carouselRemaining}/5</b>
              </p>
            )}

            {/* Emplacements */}
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-2">Emplacements d’affichage</span>

              <div className="flex flex-wrap gap-3 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.placements?.topOfPage ?? false}
                    disabled={topTaken && !(form.placements?.topOfPage ?? false)}
                    onChange={(e) => handlePlacementsChange("topOfPage", e.target.checked)}
                    className="accent-blue-600 h-4 w-4 disabled:opacity-50"
                  />
                  Haut de page
                  {topTaken && !(form.placements?.topOfPage ?? false) && (
                    <span className="text-[11px] text-gray-400">(déjà utilisé)</span>
                  )}
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.placements?.popup ?? false}
                    disabled={popupTaken && !(form.placements?.popup ?? false)}
                    onChange={(e) => handlePlacementsChange("popup", e.target.checked)}
                    className="accent-blue-600 h-4 w-4 disabled:opacity-50"
                  />
                  Popup
                  {popupTaken && !(form.placements?.popup ?? false) && (
                    <span className="text-[11px] text-gray-400">(déjà utilisé)</span>
                  )}
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.placements?.carousel ?? false}
                    onChange={(e) => handlePlacementsChange("carousel", e.target.checked)}
                    className="accent-blue-600 h-4 w-4"
                  />
                  Carrousel
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.placements?.searchPage ?? false}
                    disabled={searchTaken && !(form.placements?.searchPage ?? false)}
                    onChange={(e) => handlePlacementsChange("searchPage", e.target.checked)}
                    className="accent-blue-600 h-4 w-4 disabled:opacity-50"
                  />
                  Bannière page de recherche
                  {searchTaken && !(form.placements?.searchPage ?? false) && (
                    <span className="text-[11px] text-gray-400">(déjà utilisée)</span>
                  )}
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t">
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={resetToCreate}
                  className="px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Annuler l’édition
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 shadow-md transition"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "create" ? "Créer l’encart" : "Enregistrer les modifications"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal suppression */}
     {bannerToDelete && (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600">
          <Trash2 className="h-4 w-4" />
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">
            Supprimer cet encart ?
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            « {bannerToDelete.title} » sera définitivement retiré du site.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setBannerToDelete(null)}
          disabled={deleting}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          Annuler
        </button>

        <button
          type="button"
          onClick={() => deleteBanner(bannerToDelete.id)}
          disabled={deleting}
          className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-60"
        >
          {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
          Supprimer
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
