// src/components/FeatureListingButton.tsx
import { useEffect, useState } from "react";
import { Star, Loader2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../features/auth/AuthContext";
import type { Listing } from "../features/listings/types";
import {
  fetchFeaturedPlans,
  createFeaturedPaymentIntent,
  type FeaturedPlan,
} from "../features/featured/apiFeatured";
import { PERMISSIONS } from "../constants/auth";

import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface FeatureListingButtonProps {
  listing: Listing;
}

export function FeatureListingButton({ listing }: FeatureListingButtonProps) {
  const { user, isAuthenticated, hasPermission } = useAuth() as any;

  const stripe = useStripe();
  const elements = useElements();

  const [open, setOpen] = useState(false);
  const [plans, setPlans] = useState<FeaturedPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const [isPaying, setIsPaying] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // id backend du propriétaire de l'annonce (côté listing)
  const listingOwnerId =
    (listing as any).user_id ??
    (listing as any).user?.user_id ??
    null;

  // id backend du user connecté (côté auth)
  const authBackendUserId =
    (user as any)?.user_id ??
    (user as any)?.userId ??
    null;

  const hasFeaturePerm = !!hasPermission?.(PERMISSIONS.LISTING_FEATURE_BUY);

  const canFeature =
    isAuthenticated &&
    hasFeaturePerm &&
    !!listingOwnerId &&
    !!authBackendUserId &&
    authBackendUserId === listingOwnerId;

  if (!canFeature) return null;

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const loadPlans = async () => {
      try {
        setLoadingPlans(true);
        const data = await fetchFeaturedPlans();
        if (!cancelled) {
          setPlans(data);
          if (data.length > 0) setSelectedPlanId(data[0].id);
        }
      } catch (e: any) {
        console.error(e);
        if (!cancelled) {
          toast.error(e?.message || "Erreur lors du chargement des plans");
        }
      } finally {
        if (!cancelled) setLoadingPlans(false);
      }
    };

    void loadPlans();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlanId) {
      toast.error("Veuillez choisir un plan");
      return;
    }
    if (!stripe || !elements) {
      toast.error("Le système de paiement n’est pas prêt. Réessayez dans un instant.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Formulaire de carte introuvable");
      return;
    }

    try {
      setIsPaying(true);

      // Créer le PaymentIntent côté back
      const { clientSecret: cs } = await createFeaturedPaymentIntent(
        listing.id,
        selectedPlanId
      );
      setClientSecret(cs);

      // Confirmer le paiement côté front
      const result = await stripe.confirmCardPayment(cs, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        console.error(result.error);
        toast.error(result.error.message || "Paiement refusé");
        return;
      }

      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        toast.success("Paiement réussi ! Votre annonce va passer en Premium.");
        setOpen(false);
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Erreur lors du paiement");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100"
      >
        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
        Mettre cette annonce en avant
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Choisir un plan de mise en avant
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                disabled={isPaying}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {loadingPlans ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
              </div>
            ) : plans.length === 0 ? (
              <p className="py-4 text-sm text-gray-500">
                Aucun plan de mise en avant n’est disponible pour le moment.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Plans */}
                <div className="space-y-2">
                  {plans.map((plan) => (
                    <label
                      key={plan.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${
                        selectedPlanId === plan.id
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        className="mt-1 h-4 w-4 text-amber-600"
                        checked={selectedPlanId === plan.id}
                        onChange={() => setSelectedPlanId(plan.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">
                            {plan.name}
                          </span>
                          <span className="text-sm font-semibold text-amber-700">
                            {plan.price.toLocaleString("fr-FR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            MAD
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Durée : {plan.duration_days} jour
                          {plan.duration_days > 1 ? "s" : ""}.
                        </div>
                        {plan.description && (
                          <div className="mt-1 text-xs text-gray-600">
                            {plan.description}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {/* Stripe CardElement */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-700">
                    Carte bancaire
                  </label>
                  <div className="rounded-lg border border-gray-200 px-3 py-2">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "14px",
                          },
                        },
                      }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400">
                    Le paiement est sécurisé via Stripe. Après succès, la mise en
                    avant sera automatiquement activée.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                    disabled={isPaying}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isPaying || !selectedPlanId}
                    className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
                  >
                    {isPaying && <Loader2 className="h-4 w-4 animate-spin" />}
                    Payer et mettre en avant
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
