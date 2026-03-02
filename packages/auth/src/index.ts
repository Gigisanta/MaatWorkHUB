import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
      tenantId: string;
    }
  }
  interface User {
    role?: string;
    tenantId?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Demostration simple login override for the founders.
        if (credentials?.email === "gio@maat.work" || credentials?.email === "tomi@maat.work") {
          return { 
            id: credentials.email === "gio@maat.work" ? "founder-1" : "founder-2", 
            email: credentials.email as string, 
            name: credentials.email === "gio@maat.work" ? "Gio" : "Tomi", 
            role: "founder", 
            tenantId: "maatwork-hq" 
          };
        }
        
        // Mock default user
        return {
          id: "demo-user",
          email: credentials?.email as string,
          name: "Demo User",
          role: "admin",
          tenantId: "demo-natatorio"
        };
      }
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.tenantId = user.tenantId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.tenantId = token.tenantId as string;
      }
      return session;
    }
  }
});
