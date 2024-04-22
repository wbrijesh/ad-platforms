import NextAuth from "next-auth";
import CustomFacebookBusinessProvider from "@/authProvider";

export const authOptions = {
  providers: [CustomFacebookBusinessProvider],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }: any) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);

let url =
  "https://d4oe8ly9ij2l7.cloudfront.net/api/auth/callbacks/facebook_business";
