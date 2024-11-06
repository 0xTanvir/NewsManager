export type ContactSubmission = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "responded";
};
