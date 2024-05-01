import AuthLayout from "@/layouts/main";
import { signIn, signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { GetCookie, SetCookie } from "@/lib/cookies";
import { useRouter } from "next/router";

export default function GoogleAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      SetCookie("google-auth-session", JSON.stringify(session), 86400);
    }
  }, [session]);

  const [googleAuthSession, setGoogleAuthSession] = useState<any>(null);
  useEffect(() => {
    GetCookie("google-auth-session") &&
      setGoogleAuthSession(
        JSON.parse(GetCookie("google-auth-session") || "{}"),
      );
  }, []);

  function getNewAccessToken() {
    const refreshToken = googleAuthSession.refresh_token;
    const clientId = process.env.GOOGLE_ADS_CLIENT_ID || "";
    const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET || "";

    fetch(`https://oauth2.googleapis.com/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("get access token response: ", data);
        // update the access token in the cookie and keep rest of the data same
        const newGoogleAuthSession = {
          ...googleAuthSession,
          access_token: data.access_token,
        };
        SetCookie(
          "google-auth-session",
          JSON.stringify(newGoogleAuthSession),
          86400,
        );
      });
  }

  useEffect(() => {
    if (
      googleAuthSession &&
      googleAuthSession.user &&
      googleAuthSession.user.picture &&
      googleAuthSession.user.picture.includes("fbcdn.net")
    ) {
      SetCookie("google-auth-session", "", 0);
      signOut().then(() => {
        router.reload();
      });
    }
  }, [googleAuthSession]);

  return (
    <AuthLayout>
      <div className="m-5">
        {!googleAuthSession ? (
          <>
            <h1 className="text-xl font-medium mb-4">Log in with Google</h1>
            <button
              className="inlin-flex border border-zinc-400 text-zinc-700 shadow rounded px-2 py-1.5 font-medium bg-pink-200 hover:cursor-pointer"
              onClick={() => signIn("google")}
            >
              Sign in with Google
            </button>
          </>
        ) : (
          <>
            <details className="mb-4">
              <summary>Google Auth Session</summary>
              <pre>
                <code>{JSON.stringify(googleAuthSession, null, 2)}</code>
              </pre>
            </details>

            <button
              className="mb-4 px-2.5 py-1.5 rounded shadow bg-zinc-50 text-zinc-800 font-medium hover:bg-zinc-100 transition border border-zinc-300"
              onClick={() => getNewAccessToken()}
            >
              Get New Access Token
            </button>
            {children}
          </>
        )}
      </div>
    </AuthLayout>
  );
}
