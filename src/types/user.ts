export interface User {
  id: string;
  email: string;
  name: string;
  provider: "email" | "google" | "supabase";
  addresses: any[];
  createdAt: string;
}