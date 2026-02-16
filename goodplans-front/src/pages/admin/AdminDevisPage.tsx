import { useState, useEffect } from "react";
import { Loader2, FileText, Mail, Pencil, Megaphone } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  type AdvertisingRequest,
  type AdvertisingRequestStatus,
  apiAdminGetAdvertisingRequests,
  apiAdminUpdateAdvertisingRequestStatus,
  apiAdminUpdateAdvertisingRequestNotes,
} from "../../features/admin/adminApi";

const Devis = () => {
  const [requests, setRequests] = useState<AdvertisingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<AdvertisingRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const navigate = useNavigate();

  const fetchDevisRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiAdminGetAdvertisingRequests();
      setRequests(data || []);
    } catch (err: any) {
      console.error("Error fetching devis requests:", err);
      setError(
        err?.message || "Erreur lors du chargement des demandes de devis"
      );
      toast.error("Impossible de charger les demandes");
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (
    requestId: string,
    newStatus: AdvertisingRequestStatus
  ) => {
    try {
      await apiAdminUpdateAdvertisingRequestStatus(requestId, newStatus);

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? { ...request, status: newStatus }
            : request
        )
      );

      if (selectedRequest?.id === requestId) {
        setSelectedRequest((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      }

      toast.success("Statut mis à jour avec succès");
    } catch (err) {
      console.error("Error updating request status:", err);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const updateAdminNotes = async () => {
    if (!selectedRequest) return;

    try {
      await apiAdminUpdateAdvertisingRequestNotes(
        selectedRequest.id,
        adminNotes || null
      );

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === selectedRequest.id
            ? { ...request, admin_notes: adminNotes }
            : request
        )
      );

      setSelectedRequest((prev) =>
        prev ? { ...prev, admin_notes: adminNotes } : null
      );
      setIsEditingNotes(false);
      toast.success("Notes mises à jour avec succès");
    } catch (err) {
      console.error("Error updating admin notes:", err);
      toast.error("Erreur lors de la mise à jour des notes");
    }
  };

  useEffect(() => {
    fetchDevisRequests();
  }, []);

  useEffect(() => {
    if (selectedRequest) {
      setAdminNotes(selectedRequest.admin_notes || "");
    }
  }, [selectedRequest]);

  const filteredRequests = requests.filter((request) =>
    statusFilter === "all" ? true : request.status === statusFilter
  );

  const getStatusColor = (status: AdvertisingRequestStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "read":
        return "bg-blue-100 text-blue-800";
      case "replied":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: AdvertisingRequestStatus) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "read":
        return "Lu";
      case "replied":
        return "Répondu";
      case "archived":
        return "Archivé";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + filtres */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Demandes de devis</h1>
        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="read">Lus</option>
            <option value="replied">Répondus</option>
            <option value="archived">Archivés</option>
          </select>
          <button
            onClick={fetchDevisRequests}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Actualiser
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
          <button
            onClick={fetchDevisRequests}
            className="ml-4 text-sm underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
          Aucune demande trouvée
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste gauche */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedRequest?.id === request.id ? "bg-gray-50" : ""
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900 truncate">
                          {request.name}
                        </div>
                        <span
                          className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {getStatusLabel(request.status)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {request.company}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(
                          request.created_at
                        ).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Détails droite */}
          <div className="lg:col-span-2">
            {selectedRequest ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Détails de la demande
                      </h3>
                      <div className="mt-2 text-sm text-gray-500">
                        Reçue le{" "}
                        {new Date(
                          selectedRequest.created_at
                        ).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedRequest.status}
                        onChange={(e) =>
                          updateRequestStatus(
                            selectedRequest.id,
                            e.target.value as AdvertisingRequestStatus
                          )
                        }
                        className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      >
                        <option value="pending">En attente</option>
                        <option value="read">Lu</option>
                        <option value="replied">Répondu</option>
                        <option value="archived">Archivé</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Nom
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {selectedRequest.name}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Entreprise
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {selectedRequest.company}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Email
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {selectedRequest.email}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Durée souhaitée
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {selectedRequest.duration}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Espaces publicitaires
                        </dt>
                        <dd className="mt-1">
                          <div className="flex flex-wrap gap-2">
                            {selectedRequest.ad_space.topOfPage && (
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                Haut de page
                              </span>
                            )}
                            {selectedRequest.ad_space.popup && (
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                Popup
                              </span>
                            )}
                            {selectedRequest.ad_space.carousel && (
                              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                                Carrousel
                              </span>
                            )}
                            {selectedRequest.ad_space.searchPage && (
                              <span className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-800">
                                Bannière page de recherche
                              </span>
                            )}
                          </div>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Notes admin
                        </dt>
                        <dd className="mt-1">
                          {isEditingNotes ? (
                            <div className="space-y-2">
                              <textarea
                                value={adminNotes}
                                onChange={(e) =>
                                  setAdminNotes(e.target.value)
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                rows={4}
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setIsEditingNotes(false);
                                    setAdminNotes(
                                      selectedRequest.admin_notes || ""
                                    );
                                  }}
                                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                                >
                                  Annuler
                                </button>
                                <button
                                  onClick={updateAdminNotes}
                                  className="px-3 py-1 text-sm text-white bg-primary rounded-md hover:bg-primary-dark"
                                >
                                  Enregistrer
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="text-sm text-gray-900 whitespace-pre-wrap">
                                {selectedRequest.admin_notes ||
                                  "Aucune note"}
                              </div>
                              <button
                                onClick={() => setIsEditingNotes(true)}
                                className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="border-t pt-4 flex flex-wrap gap-3">
                    <a
                      href={`mailto:${selectedRequest.email}?subject=Re: Demande de devis publicitaire - ${selectedRequest.company}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Répondre par email
                    </a>

                    {/* Bouton pour créer un encart depuis ce devis */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/promo-banners?fromRequest=${selectedRequest.id}`
                        )
                      }
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <Megaphone className="h-4 w-4 mr-2" />
                      Créer un encart depuis ce devis
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                Sélectionnez une demande pour voir les détails
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Devis;
