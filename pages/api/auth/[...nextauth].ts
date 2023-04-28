import spotifyApi, { LOGIN_URL } from "@/lib/spotify";
import NextAuth, { Session } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import jwt from "jsonwebtoken";

async function refreshAccessToken(token: any): Promise<void> {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);
    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log("refreshed token", refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // expires in 1 hour
      refreshToken: refreshedToken
        ? refreshedToken.refresh_token
        : token.refreshToken,
    };
  } catch (error) {
    console.error(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

async function refreshSession(session: any): Promise<any> {
  const refreshedSession = await fetch("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({
      refreshToken: session.refreshToken,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!refreshedSession.ok) {
    throw new Error("Failed to refresh token");
  }

  return await refreshedSession.json();
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      // initial signin
      console.log({ token, user, account });
      if (account && user) {
        return {
          ...token,
          accessToken: account.accessToken,
          refreshToken: account.refreshToken,
          username: account.providerAccountId,
          accessTokenExpires: account.expiresAt * 1000,
        };
      }

      // returned from jwt callback (token is still valid)
      console.log("existing token is still valid");
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // refresh access token if expired
      console.log("refreshing access token...");
      return await refreshAccessToken(token);
    },

    async session({ session, token }: any) {
      console.log("session callback");
      const secret = process.env.NEXTAUTH_SECRET;
      if (secret === undefined) {
        throw new Error("Unable to load Environment variables");
      }
      const encodedToken = jwt.sign(token, secret, { algorithm: "HS256" });

      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;
      // session.user.accessTokenExpires = token.accessTokenExpires;

      return session;
    },
  },
};

export default NextAuth(authOptions);
