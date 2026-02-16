// src/pages/CreateListing.tsx

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check as CheckIcon, Eye, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { CategoryStep } from "../features/listings/create/components/CategoryStep";
import { GeneralInfoStep } from "../features/listings/create/components/GeneralInfoStep";
import { SpecificDetailsStep } from "../features/listings/create/components/SpecificDetailsStep";
import { PricingStep } from "../features/listings/create/components/PricingStep";
import { ImagesStep } from "../features/listings/create/components/ImagesStep";
import { SubmissionStep } from "../features/listings/create/components/SubmissionStep";
import { StepNavigation } from "../features/listings/create/components/StepNavigation";
import { ListingPreview } from "../features/listings/create/components/ListingPreview";

import {
  createListingWithCategory,
  type CreateListingPayload,
} from "../features/listings/create/api/apiCreateListing";

import { useAuth } from "../features/auth/AuthContext";
import { getProfile, isSellerAccount } from "../features/user/api/userApi";
import { ROLES } from "../constants/auth";
import { useLanguage } from "../lib/language/LanguageContext";

const AUTH_STORAGE_KEY = "gp_auth";
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

type TransactionTypeUI = "" | "achat" | "location";
type RentalPeriod = "" | "day" | "week" | "month" | "year";

const STEPS = [
  "category",
  "generalInfo",
  "specificDetails",
  "pricing",
  "images",
  "submission",
] as const;

type StepId = (typeof STEPS)[number];

interface ListingState {
  category: string;
  title: string;
  description: string;
  city: string;
  region: string;
  price: string;
  transaction_type: TransactionTypeUI;
  rental_period: RentalPeriod;
  minimum_rental_period?: string;
  availability_date?: string;
}

/* -------------------------------------------------------------------------- */
/*           1) WRAPPER : vérifie le statut vendeur puis rend le wizard       */
/* -------------------------------------------------------------------------- */

export default function CreateListing() {

  const { t } = useLanguage();

  const navigate = useNavigate();
  const { user } = useAuth();

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkSellerAccess() {
      if (!user) {
        navigate("/login?from=create-listing");
        if (!cancelled) setChecking(false);
        return;
      }

      if (
        Array.isArray(user.roles) &&
        (user.roles.includes(ROLES.ADMIN) || user.roles.includes(ROLES.SUPER_ADMIN))
      ) {
        if (!cancelled) {
          setAllowed(true);
          setChecking(false);
        }
        return;
      }

      try {
        const profile = await getProfile();

        const isSeller = isSellerAccount(profile.account_type, profile.is_seller);
        const sellerApproved = profile.seller_approved === true;

        if (isSeller && sellerApproved) {
          if (!cancelled) {
            setAllowed(true);
            setChecking(false);
          }
          return;
        }

        if (isSeller && !sellerApproved) {
          toast.error(
            t("createListing.guard.pendingApproval")
          );
          navigate("/profile?from=create-listing&status=pending");
          return;
        }

        toast.error(
          t("createListing.guard.notSeller")
        );
        navigate("/profile?from=create-listing&status=not-seller");
      } catch (error) {
        console.error("Erreur lors de la vérification du statut vendeur", error);
        toast.error(t("createListing.guard.statusCheckFailed"));
        navigate("/");
      } finally {
        if (!cancelled) setChecking(false);
      }
    }


    void checkSellerAccess();

    return () => {
      cancelled = true;
    };
  }, [user, navigate]);

  // Pendant la vérif
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center text-sm text-blue-600">
          <Loader className="h-5 w-5 animate-spin mr-2" />
          <span>{t("createListing.guard.checking")}</span>
        </div>
      </div>
    );
  }

  // Si pas allowed, on a déjà fait un navigate() → on peut rendre null
  if (!allowed) {
    return null;
  }

  // Ici, on est sûr que l’utilisateur a le droit → on rend le vrai wizard
  return <CreateListingWizard />;
}

/* -------------------------------------------------------------------------- */
/*                 2) WIZARD : tous les hooks, aucun guard ici                */
/* -------------------------------------------------------------------------- */

function CreateListingWizard() {

  const { t } = useLanguage();

  const navigate = useNavigate();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const step: StepId = STEPS[currentStepIndex];

  const [listing, setListing] = useState<ListingState>({
    category: "",
    title: "",
    description: "",
    city: "",
    region: "",
    price: "",
    transaction_type: "",
    rental_period: "",
  });

  const [details, setDetails] = useState<Record<string, any>>({});
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [hasInappropriateContent, setHasInappropriateContent] =
    useState(false);
  const [inappropriateContentMessage, setInappropriateContentMessage] =
    useState<string | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function isStepValid(idx: number): boolean {
    const s = STEPS[idx];

    if (s === "category") {
      return !!listing.category;
    }

    if (s === "generalInfo") {
      return (
        listing.title.trim().length > 0 &&
        listing.description.trim().length > 0 &&
        listing.city.trim().length > 0 &&
        listing.region.trim().length > 0
      );
    }

    if (s === "specificDetails") {
      if (!listing.category) return false;

      if (listing.category === "real_estate") {
        return !!details.property_type && !!details.surface;
      }

      if (listing.category === "vehicle") {
        return (
          !!details.brand_id &&
          !!details.model_id &&
          !!details.year &&
          !!details.mileage
        );
      }

      if (listing.category === "service") {
        return !!details.service_type;
      }

      if (listing.category === "craft") {
        return !!details.craft_type;
      }

      return true;
    }

    if (s === "pricing") {
      const price = Number(listing.price);
      if (!price || price <= 0) return false;

      if (listing.transaction_type === "location") {
        return !!listing.rental_period;
      }
      return true;
    }

    if (s === "images") {
      return images.length > 0;
    }

    if (s === "submission") {
      return (
        isStepValid(0) &&
        isStepValid(1) &&
        isStepValid(2) &&
        isStepValid(3) &&
        isStepValid(4)
      );
    }

    return true;
  }

  const isCurrentStepValid = useMemo(
    () => isStepValid(currentStepIndex),
    [currentStepIndex, listing, details, images]
  );

  const totalSteps = STEPS.length;
  const isLastStep = currentStepIndex === totalSteps - 1;

  function handlePrev() {
    if (currentStepIndex === 0 || submitting) return;
    setCurrentStepIndex((prev) => prev - 1);
  }

  async function handleNext() {
    if (submitting) return;
    if (!isCurrentStepValid) {
      toast.error(
        t("createListing.validation.requiredFields")
      );
      return;
    }

    if (isLastStep) {
      await handleCreateListing();
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
  }

  async function handleImagesSelected(files: FileList) {
    if (!files || files.length === 0) return;

    const remainingSlots = 10 - images.length;
    if (remainingSlots <= 0) {
      toast.error(t("createListing.images.maxReached"));
      return;
    }

    setUploadingImages(true);

    try {
      const formData = new FormData();
      Array.from(files)
        .slice(0, remainingSlots)
        .forEach((file) => {
          formData.append("files", file);
        });

      let headers: HeadersInit = {};
      try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { accessToken?: string };
          if (parsed.accessToken) {
            headers = {
              Authorization: `Bearer ${parsed.accessToken}`,
            };
          }
        }
      } catch {
        // ignore
      }

      const res = await fetch(`${API_BASE_URL}/uploads/listings-images`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `HTTP ${res.status}`);
      }

      const data: { urls: string[]; message?: string } = await res.json();
      const newUrls = data.urls || [];

      if (!newUrls.length) {
        throw new Error("Aucune URL d’image retournée par le serveur.");
      }

      setImages((prev) => [...prev, ...newUrls].slice(0, 10));
      toast.success("Images ajoutées avec succès.");
    } catch (error: any) {
      console.error("Erreur upload images", error);
      toast.error(
        error?.message ||
        t("createListing.images.noUrlReturned")
      );
    } finally {
      setUploadingImages(false);
    }
  }

  function handleRemoveImage(index: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  }

  function mapTransactionTypeToBackend(
    t: TransactionTypeUI
  ): "sale" | "rent" | null {
    if (t === "achat") return "sale";
    if (t === "location") return "rent";
    return null;
  }

  async function handleCreateListing() {
    if (
      !isStepValid(0) ||
      !isStepValid(1) ||
      !isStepValid(2) ||
      !isStepValid(3) ||
      !isStepValid(4)
    ) {
      const msg = t("createListing.validation.missingFields");
      setSubmitError(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const priceNumber = Number(listing.price);

      const payload: CreateListingPayload = {
        category: listing.category,
        title: listing.title.trim(),
        description: listing.description.trim(),
        city: listing.city.trim(),
        region: listing.region.trim(),
        price: Number.isNaN(priceNumber) ? 0 : priceNumber,
        transaction_type: mapTransactionTypeToBackend(
          listing.transaction_type
        ),
        rental_period:
          listing.transaction_type === "location" &&
            listing.rental_period
            ? listing.rental_period
            : null,
        images,
        filters: {},
        details,
      };

      await createListingWithCategory(payload);

      setSubmitSuccess(true);
      toast.success(t("createListing.success.created"));
      navigate("/seller/listings");
    } catch (error: any) {
      console.error("Erreur création annonce", error);
      const msg =
        error?.message ||
        t("createListing.errors.creationFailed");
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const progressPercent = useMemo(() => {
    const ratio = currentStepIndex / (totalSteps - 1);
    return Math.min(Math.round(ratio * 100), 100);
  }, [currentStepIndex, totalSteps]);

  const stepLabels: Record<StepId, string> = {
    category: t("createListing.steps.category"),
    generalInfo: t("createListing.steps.generalInfo"),
    specificDetails: t("createListing.steps.specificDetails"),
    pricing: t("createListing.steps.pricing"),
    images: t("createListing.steps.images"),
    submission: t("createListing.steps.submission"),
  };

  useEffect(() => {
    setHasInappropriateContent(false);
    setInappropriateContentMessage(null);
  }, [listing.title, listing.description]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold">
            {t("createListing.wizard.title")}
          </h1>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
              {t("createListing.wizard.preview")}
            </button>
          </div>
        </div>

        {/* Alerte contenu inapproprié */}
        {hasInappropriateContent && (
          <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-white border-l-4 border-red-500 rounded-lg shadow-sm flex items-start">
            <div className="bg-red-50 p-2 rounded-full mr-3">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-gray-800 font-medium text-sm">
                {t("createListing.inappropriate.title")}
              </p>
              <p className="text-gray-600 text-xs mt-1">
                {inappropriateContentMessage ||
                  t("createListing.inappropriate.description")}
              </p>
            </div>
          </div>
        )}

        {/* Barre de progression */}
        <div className="mb-4 sm:mb-6 bg-white rounded-lg shadow-sm p-2 sm:p-4">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <h3 className="text-xs font-medium text-gray-800">
              {t("createListing.wizard.stepsTitle")}
            </h3>
            <div className="bg-blue-600/10 px-2 py-0.5 rounded-full">
              <span className="text-[10px] font-semibold text-blue-600">
                {progressPercent}%
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute bottom-3 left-0 right-0 h-1 bg-gray-100 rounded-full" />
            <div
              className="absolute bottom-3 left-0 h-1 bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progressPercent}%` }}
            />

            <div className="relative flex justify-between items-center pt-1 pb-6">
              {STEPS.map((id, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;

                return (
                  <div
                    key={id}
                    className="flex flex-col items-center relative group"
                  >
                    <div
                      className={`flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-full mb-1
                        ${isActive
                          ? "bg-blue-600 text-white"
                          : isCompleted
                            ? "bg-blue-600 text-white"
                            : "bg-gray-50 text-gray-400"
                        }
                        ${isActive
                          ? "shadow-md ring-2 ring-blue-600/20"
                          : isCompleted
                            ? "shadow-sm"
                            : "border border-gray-200"
                        }
                        transition-all duration-300 ease-in-out group-hover:scale-105`}
                    >
                      {isCompleted ? (
                        <CheckIcon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                      ) : (
                        <span className="text-xs font-medium">
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[9px] sm:text-xs font-medium text-center
                        ${isActive
                          ? "text-blue-600"
                          : isCompleted
                            ? "text-gray-700"
                            : "text-gray-400"
                        }`}
                    >
                      {stepLabels[id]}
                    </span>

                    {isActive && (
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form principal */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-3 sm:p-6">
                {step === "category" && (
                  <CategoryStep
                    value={listing.category}
                    transactionType={
                      listing.transaction_type === "achat"
                        ? "sale"
                        : listing.transaction_type === "location"
                          ? "rent"
                          : ""
                    }
                    onChangeCategory={(value: any) =>
                      setListing((prev) => ({ ...prev, category: value }))
                    }
                    onChangeTransactionType={(v: string) =>
                      setListing((prev) => ({
                        ...prev,
                        transaction_type:
                          v === "sale"
                            ? "achat"
                            : v === "rent"
                              ? "location"
                              : "",
                      }))
                    }
                  />
                )}

                {step === "generalInfo" && (
                  <GeneralInfoStep
                    values={{
                      title: listing.title,
                      description: listing.description,
                      city: listing.city,
                      region: listing.region,
                    }}
                    onChange={(partial) =>
                      setListing((prev) => ({ ...prev, ...partial }))
                    }
                  />
                )}

                {step === "specificDetails" && (
                  <SpecificDetailsStep
                    category={listing.category}
                    details={details}
                    onChange={(partial) =>
                      setDetails((prev) => ({ ...prev, ...partial }))
                    }
                  />
                )}

                {step === "pricing" && (
                  <PricingStep
                    category={listing.category}
                    values={{
                      price: listing.price,
                      transaction_type: listing.transaction_type,
                      rental_period: listing.rental_period,
                      minimum_rental_period: listing.minimum_rental_period,
                      availability_date: listing.availability_date,
                    }}
                    onChange={(partial) =>
                      setListing((prev) => ({ ...prev, ...partial }))
                    }
                  />
                )}

                {step === "images" && (
                  <ImagesStep
                    images={images}
                    uploading={uploadingImages}
                    onSelectFiles={handleImagesSelected}
                    onRemoveImage={handleRemoveImage}
                  />
                )}

                {step === "submission" && (
                  <SubmissionStep
                    listing={{ ...listing, images }}
                    details={details}
                    category={listing.category}
                    createListing={handleCreateListing}
                    loading={submitting}
                  />
                )}

                {submitError && (
                  <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700">
                    {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-200 text-xs sm:text-sm text-green-700">
                    {t("createListing.success.created")}
                  </div>
                )}
              </div>

              <div className="px-3 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
                <StepNavigation
                  currentStep={currentStepIndex}
                  totalSteps={totalSteps}
                  isLastStep={isLastStep}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  disabled={!isCurrentStepValid || uploadingImages}
                  loading={submitting}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Prévisualisation */}
      <ListingPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        listing={{
          title: listing.title,
          description: listing.description,
          city: listing.city,
          region: listing.region,
          price: listing.price,
          transaction_type: listing.transaction_type,
          rental_period: listing.rental_period,
          images,
        }}
        category={listing.category}
        details={details}
      />
    </div>
  );
}
