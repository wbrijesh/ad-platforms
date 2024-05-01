import NextAuth from "next-auth";
import CustomFacebookBusinessProvider from "@/authProvider";
import Google from "next-auth/providers/google";

export const authOptions = {
  providers: [
    CustomFacebookBusinessProvider,
    Google({
      clientId: process.env.GOOGLE_ADS_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET || "",
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          scope: "https://www.googleapis.com/auth/adwords openid email profile",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // async jwt({ token, account }: any) {
    //   if (account) {
    //     token.accessToken = account.access_token;
    //   }
    //   return token;
    // },
    // async session({ session, token, user }: any) {
    //   session.accessToken = token.accessToken;
    //   return session;
    // },
    async jwt({ token, account }: { token: any; account: any }) {
      if (account) {
        // Save the access token and refresh token in the JWT on the initial login, as well as the user details
        return {
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          user: token,
        };
      } else if (Date.now() < token.expires_at * 1000) {
        // If the access token has not expired yet, return it
        return token;
      } else {
        if (!token.refresh_token) throw new Error("Missing refresh token");

        // If the access token has expired, try to refresh it
        try {
          // https://accounts.google.com/.well-known/openid-configuration
          // We need the `token_endpoint`.
          const response = await fetch("https://oauth2.googleapis.com/token", {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.AUTH_GOOGLE_ID!,
              client_secret: process.env.AUTH_GOOGLE_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refresh_token,
            }),
            method: "POST",
          });

          const tokens = await response.json();

          if (!response.ok) throw tokens;

          return {
            ...token, // Keep the previous token properties
            access_token: tokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
            // Fall back to old refresh token, but note that
            // many providers may only allow using a refresh token once.
            refresh_token: tokens.refresh_token ?? token.refresh_token,
          };
        } catch (error) {
          console.error("Error refreshing access token", error);
          // The error property will be used client-side to handle the refresh token error
          return { ...token, error: "RefreshAccessTokenError" as const };
        }
      }
    },
    async session({ session, token }: { session: any; token: any }) {
      session.error = token.error;
      return {
        ...session,
        ...token,
      };
    },
  },
};

declare module "next-auth" {
  interface Session {
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    expires_at: number;
    refresh_token: string;
    error?: "RefreshAccessTokenError";
  }
}

export default NextAuth(authOptions);

let url =
  "https://d4oe8ly9ij2l7.cloudfront.net/api/auth/callbacks/facebook_business";
