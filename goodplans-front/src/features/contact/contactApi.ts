import { apiRequest } from "../../lib/apiRequest";

export type ContactFormPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function apiSendContactMessage(payload: ContactFormPayload) {
  return apiRequest<void>("POST", "/contact-messages", payload);
}
