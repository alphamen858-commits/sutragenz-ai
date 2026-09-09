import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      plan: string;
      xp: number;
      streak: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
