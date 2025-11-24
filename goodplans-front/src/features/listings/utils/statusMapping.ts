export type ListingStatusApi = "En attente" | "Publié" | "Rejeté" | "Suspendu" | "Vendu";
export type ListingStatusUi = ListingStatusApi | "active" | "paused" | "sold";

export function mapUiStatusToApi(status: ListingStatusUi): ListingStatusApi {
  switch (status) {
    case "active":
      return "Publié";
    case "paused":
      return "Suspendu";
    case "sold":
      return "Vendu";
    case "Publié":
    case "Rejeté":
    case "Suspendu":
    case "Vendu":
      return status;
    default:
      return "En attente";
  }
}

export function mapApiStatusToUi(status?: string | null): ListingStatusApi {
  switch (status) {
    case "Publié":
    case "Rejeté":
    case "Suspendu":
    case "Vendu":
    case "En attente":
      return status;
    case "active":
      return "Publié";
    case "paused":
      return "Suspendu";
    case "sold":
      return "Vendu";
    default:
      return "En attente";
  }
}
