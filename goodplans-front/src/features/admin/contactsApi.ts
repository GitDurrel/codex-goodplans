import { apiRequest } from "../../lib/apiRequest";

export type ContactMessageStatus = "pending" | "read" | "replied" | "archived";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: ContactMessageStatus;
  admin_notes: string | null;
};

export function apiGetContactMessages(params?: { status?: string }) {
  const query = params?.status ? `?status=${params.status}` : "";
  return apiRequest<ContactMessage[]>("GET", `/admin/contacts${query}`);
}

export function apiUpdateContactStatus(
  id: string,
  status: ContactMessageStatus
) {
  return apiRequest<ContactMessage>("PATCH", `/admin/contacts/${id}/status`, {
    status,
  });
}

export function apiUpdateContactNotes(id: string, admin_notes: string) {
  return apiRequest<ContactMessage>("PATCH", `/admin/contacts/${id}/notes`, {
    admin_notes,
  });
}
