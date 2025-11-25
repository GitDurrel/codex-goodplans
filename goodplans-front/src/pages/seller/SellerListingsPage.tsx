import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, PauseCircle, PlayCircle, Filter, Search, AlertCircle, ChevronDown, ArrowUpDown } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../features/auth/AuthContext";
import {
  deleteListing,
  fetchMyListings,
  updateListingStatus,
} from "../../features/listings/apiListings";
import type { Listing } from "../../features/listings/types";
import { validateListing } from "../../features/listings/utils/listingValidation";
import { mapApiStatusToUi, mapUiStatusToApi } from "../../features/listings/utils/statusMapping";
import type { ListingStatusApi } from "../../features/listings/utils/statusMapping";

type StatusFilter = ListingStatusApi | "all";

export default function SellerListingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOption, setSortOption] = useState("newest");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadListings = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const raw = await fetchMyListings();
        const validated = raw
          .map((item) => {
            try {
              return validateListing(item);
            } catch (error) {
              console.warn("Invalid listing skipped", item, error);
              return null;
            }
          })
          .filter((l): l is Listing => l !== null)
          .map((l) => ({ ...l, status: mapApiStatusToUi(l.status) }));

        setListings(validated);
        setFilteredListings(validated);
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors du chargement de vos annonces");
      } finally {
        setIsLoading(false);
      }
    };

    void loadListings();
  }, [user]);

  useEffect(() => {
    let result = [...listings];

    if (statusFilter !== "all") {
      result = result.filter((listing) => mapApiStatusToUi(listing.status) === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (listing) =>
          listing.title.toLowerCase().includes(term) ||
          (listing.description ?? "").toLowerCase().includes(term),
      );
    }

    switch (sortOption) {
      case "newest":
        result.sort(
          (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime(),
        );
        break;
      case "oldest":
        result.sort(
          (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime(),
        );
        break;
      case "price_high":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "price_low":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "views":
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        break;
    }

    setFilteredListings(result);
    setCurrentPage(1);
  }, [listings, statusFilter, searchTerm, sortOption]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentListings = useMemo(
    () => filteredListings.slice(startIndex, endIndex),
    [filteredListings, startIndex, endIndex],
  );
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage) || 1;

  const handleDeleteListing = async () => {
    if (!listingToDelete) return;
    try {
      await deleteListing(listingToDelete.id);
      setListings((prev) => prev.filter((l) => l.id !== listingToDelete.id));
      setFilteredListings((prev) => prev.filter((l) => l.id !== listingToDelete.id));
      toast.success("Annonce supprimée");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'annonce:", error);
      toast.error("Impossible de supprimer l'annonce");
    } finally {
      setShowDeleteModal(false);
      setListingToDelete(null);
    }
  };

  const handleUpdateStatus = async (listingId: string, newStatus: ListingStatusApi) => {
    try {
      const updated = await updateListingStatus(listingId, mapUiStatusToApi(newStatus));
      const normalizedStatus = mapApiStatusToUi(updated.status);
      setListings((prev) => prev.map((l) => (l.id === listingId ? { ...l, status: normalizedStatus } : l)));
      toast.success("Statut mis à jour");
    } catch (error) {
      console.error("Error updating listing status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleEditListing = (listingId: string) => {
    navigate(`/edit-listing/${listingId}`);
  };

  const getStatusBadge = (status?: string) => {
    const normalized = mapApiStatusToUi(status);
    switch (normalized) {
      case "En attente":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
      case "Publié":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Publié</span>;
      case "Suspendu":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">Suspendu</span>;
      case "Vendu":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Vendu</span>;
      case "Rejeté":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rejeté</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Inconnu</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="all">Tous les statuts</option>
              <option value="Publié">Publié</option>
              <option value="En attente">En attente</option>
              <option value="Suspendu">Suspendu</option>
              <option value="Vendu">Vendu</option>
              <option value="Rejeté">Rejeté</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ArrowUpDown className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none bg-white"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Plus récentes</option>
              <option value="oldest">Plus anciennes</option>
              <option value="price_high">Prix décroissant</option>
              <option value="price_low">Prix croissant</option>
              <option value="views">Plus vues</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="block sm:hidden">
          {currentListings.map((listing) => (
            <div key={listing.id} className="p-4 border-b border-gray-200 last:border-b-0">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 truncate">{listing.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{formatPrice(listing.price)}</p>
                    </div>
                    {getStatusBadge(listing.status)}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleEditListing(listing.id)}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setListingToDelete(listing);
                        setShowDeleteModal(true);
                      }}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {mapApiStatusToUi(listing.status) === "Publié" ? (
                      <button
                        onClick={() => handleUpdateStatus(listing.id, "Suspendu")}
                        className="p-1.5 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-full"
                      >
                        <PauseCircle className="h-4 w-4" />
                      </button>
                    ) : mapApiStatusToUi(listing.status) === "Suspendu" ? (
                      <button
                        onClick={() => handleUpdateStatus(listing.id, "Publié")}
                        className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full"
                      >
                        <PlayCircle className="h-4 w-4" />
                      </button>
                    ) : null}

                    {mapApiStatusToUi(listing.status) !== "Vendu" && mapApiStatusToUi(listing.status) !== "En attente" && (
                      <button
                        onClick={() => handleUpdateStatus(listing.id, "Vendu")}
                        className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-md"
                      >
                        Marquer comme vendu
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden sm:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annonce</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vues</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                        {getCategoryIcon(listing.category)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{listing.title}</div>
                        <div className="text-sm text-gray-500">{listing.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatPrice(listing.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(listing.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Eye className="h-4 w-4 text-gray-400 mr-1" />
                      {listing.views}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{listing.messages ?? 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(listing.created_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link to={`/listings/${listing.id}`} className="text-gray-400 hover:text-gray-500" title="Voir">
                        <Eye className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleEditListing(listing.id)}
                        className="text-blue-400 hover:text-blue-500"
                        title="Éditer"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      {mapApiStatusToUi(listing.status) === "Publié" ? (
                        <button
                          onClick={() => handleUpdateStatus(listing.id, "Suspendu")}
                          className="text-amber-400 hover:text-amber-500"
                          title="Mettre en pause"
                        >
                          <PauseCircle className="h-5 w-5" />
                        </button>
                      ) : mapApiStatusToUi(listing.status) === "Suspendu" ? (
                        <button
                          onClick={() => handleUpdateStatus(listing.id, "Publié")}
                          className="text-green-400 hover:text-green-500"
                          title="Réactiver"
                        >
                          <PlayCircle className="h-5 w-5" />
                        </button>
                      ) : null}
                      {mapApiStatusToUi(listing.status) !== "Vendu" && mapApiStatusToUi(listing.status) !== "En attente" && (
                        <button
                          onClick={() => handleUpdateStatus(listing.id, "Vendu")}
                          className="px-2 py-1 text-xs font-semibold bg-red-400 text-white rounded-md"
                          title="Marquer comme vendu"
                        >
                          Marquer comme vendu
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setListingToDelete(listing);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-400 hover:text-red-500"
                        title="Supprimer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">{startIndex + 1}</span> à {" "}
                  <span className="font-medium">{Math.min(endIndex, filteredListings.length)}</span> sur {" "}
                  <span className="font-medium">{filteredListings.length}</span> résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &laquo;
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &lsaquo;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      if (totalPages <= 5) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (Math.abs(page - currentPage) <= 1) return true;
                      return false;
                    })
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? "z-10 bg-primary border-primary text-white"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &rsaquo;
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &raquo;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Supprimer cette annonce ?</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Cette action est irréversible.</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteListing}
                >
                  Supprimer
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setListingToDelete(null);
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
  }).format(price || 0);
}

function formatDate(dateString?: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "immobilier":
      return (
        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case "auto-moto":
    case "vehicle":
      return (
        <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 4H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 16v2a2 2 0 002 2h8a2 2 0 002-2v-2" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <circle cx="15.5" cy="9.5" r="1.5" />
        </svg>
      );
    case "services":
      return (
        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case "deco-artisanat":
    case "craft":
      return (
        <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      );
    default:
      return (
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
  }
}
