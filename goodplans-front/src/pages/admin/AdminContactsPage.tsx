import { useEffect, useState } from "react";
import {
  Loader2,
  Mail,
  Pencil,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  apiGetContactMessages,
  apiUpdateContactStatus,
  apiUpdateContactNotes,
  type ContactMessage,
  type ContactMessageStatus,
} from "../../features/admin/contactsApi";

type StatusFilter = "all" | ContactMessageStatus;

function getStatusColor(status: ContactMessageStatus) {
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
}

function getStatusLabel(status: ContactMessageStatus) {
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
}

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessage | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  async function fetchMessages() {
    try {
      setLoading(true);
      setError(null);

      const res = await apiGetContactMessages({
        status: statusFilter !== "all" ? statusFilter : undefined,
      });

      setMessages(res);

      // Si le message sélectionné ne fait plus partie de la liste filtrée
      if (
        selectedMessage &&
        !res.find((m) => m.id === selectedMessage.id)
      ) {
        setSelectedMessage(null);
        setIsEditingNotes(false);
      }
    } catch (err: any) {
      console.error(err);
      setError("Erreur lors du chargement des messages");
      toast.error("Impossible de charger les messages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    if (selectedMessage) {
      setAdminNotes(selectedMessage.admin_notes || "");
    }
  }, [selectedMessage]);

  async function handleUpdateStatus(
    messageId: string,
    newStatus: ContactMessageStatus
  ) {
    try {
      const updated = await apiUpdateContactStatus(messageId, newStatus);

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? updated : m))
      );

      if (selectedMessage?.id === messageId) {
        setSelectedMessage(updated);
      }

      toast.success("Statut mis à jour avec succès");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  }

  async function handleUpdateNotes() {
    if (!selectedMessage) return;

    try {
      const updated = await apiUpdateContactNotes(
        selectedMessage.id,
        adminNotes
      );

      setMessages((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m))
      );

      setSelectedMessage(updated);
      setIsEditingNotes(false);
      toast.success("Notes mises à jour avec succès");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour des notes");
    }
  }

  if (loading && messages.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Demandes de contact</h1>
          <p className="text-sm text-slate-500">
            Messages envoyés depuis le formulaire de contact du site.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as StatusFilter)
            }
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="read">Lus</option>
            <option value="replied">Répondus</option>
            <option value="archived">Archivés</option>
          </select>

          <button
            type="button"
            onClick={fetchMessages}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Actualiser
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
          {error}{" "}
          <button
            onClick={fetchMessages}
            className="ml-2 underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="rounded-lg border border-slate-100 bg-white p-6 text-center text-sm text-slate-500">
          Aucun message trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Liste des messages */}
          <div className="rounded-lg border border-slate-100 bg-white shadow-sm lg:col-span-1">
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
              {messages.map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => setSelectedMessage(message)}
                  className={`flex w-full cursor-pointer border-b px-4 py-3 text-left hover:bg-slate-50 ${
                    selectedMessage?.id === message.id
                      ? "bg-slate-50"
                      : ""
                  }`}
                >
                  <Mail className="mr-3 mt-1 h-5 w-5 text-slate-400" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="max-w-[160px] truncate text-sm font-medium text-slate-900">
                        {message.name}
                      </p>
                      <span
                        className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(
                          message.status
                        )}`}
                      >
                        {getStatusLabel(message.status)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {message.subject}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {new Date(message.created_at).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Détails */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Détails du message
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Reçu le{" "}
                      {new Date(
                        selectedMessage.created_at
                      ).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedMessage.status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          selectedMessage.id,
                          e.target.value as ContactMessageStatus
                        )
                      }
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="pending">En attente</option>
                      <option value="read">Lu</option>
                      <option value="replied">Répondu</option>
                      <option value="archived">Archivé</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4 text-sm">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Nom
                    </p>
                    <p className="mt-0.5 text-slate-900">
                      {selectedMessage.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Email
                    </p>
                    <p className="mt-0.5 text-slate-900">
                      {selectedMessage.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Sujet
                    </p>
                    <p className="mt-0.5 text-slate-900">
                      {selectedMessage.subject}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Message
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-slate-900">
                      {selectedMessage.message}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium text-slate-500">
                      Notes admin
                    </p>
                    {isEditingNotes ? (
                      <div className="space-y-2">
                        <textarea
                          value={adminNotes}
                          onChange={(e) =>
                            setAdminNotes(e.target.value)
                          }
                          rows={4}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingNotes(false);
                              setAdminNotes(
                                selectedMessage.admin_notes || ""
                              );
                            }}
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                          >
                            Annuler
                          </button>
                          <button
                            type="button"
                            onClick={handleUpdateNotes}
                            className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            Enregistrer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <p className="whitespace-pre-wrap text-slate-900">
                          {selectedMessage.admin_notes ||
                            "Aucune note"}
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsEditingNotes(true)}
                          className="mt-0.5 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                        selectedMessage.subject
                      )}`}
                      className="inline-flex items-center rounded-full border border-blue-600 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Répondre par email
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                Sélectionne un message dans la liste pour voir les détails.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
