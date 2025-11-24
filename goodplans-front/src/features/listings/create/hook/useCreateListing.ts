// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetchJson } from "../../utils/authFetchJson";

export function useCreateListing() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function createListing(allData: any) {
    const { listing, details, category } = allData;

    try {
      setLoading(true);

      /** 1️⃣ CREATE BASE LISTING */
      const createdListing = await authFetchJson("/listings", {
        method: "POST",
        body: JSON.stringify(listing),
      });

      const listingId = createdListing.id;

      /** 2️⃣ CREATE CATEGORY DETAILS */
      let endpoint = "";

      switch (category) {
        case "vehicules":
          endpoint = "/vehicle-listings";
          break;
        case "immobilier":
          endpoint = "/real-estate-listings";
          break;
        case "services":
          endpoint = "/service-listings";
          break;
        case "artisanat":
          endpoint = "/craft-listings";
          break;
      }

      await authFetchJson(endpoint, {
        method: "POST",
        body: JSON.stringify({
          listing_id: listingId,
          ...details,
        }),
      });

      navigate(`/listings/${listingId}`);
    } catch (err) {
      console.error("Erreur création listing", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { createListing, loading };
}
