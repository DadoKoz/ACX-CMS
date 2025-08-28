import NextAuth from "next-auth";

// Proširujemo tipove za NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;  // Dodajemo 'id' korisnika
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;  // Dodajemo 'id' korisniku
    name: string;
    email: string;
    image?: string | null;
  }
}
