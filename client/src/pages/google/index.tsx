import React, { useEffect, useState } from "react";
import GoogleAuthLayout from "@/layouts/google_auth";
import { GetCookie } from "@/lib/cookies";

export default function Home() {
  const [googleAuthSession, setGoogleAuthSession] = useState<any>(null);
  useEffect(() => {
    GetCookie("google-auth-session") &&
      setGoogleAuthSession(
        JSON.parse(GetCookie("google-auth-session") || "{}"),
      );
  }, []);

  const [campaigns, setCampaigns] = useState<any>([]);
  function getPausedCampaigns() {
    fetch(`http://localhost:4000/v1/google/campaigns`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GetCookie("ad_platforms_token"),
        access_token: googleAuthSession.access_token,
      },
    })
      .then((response) => response.json())
      .then((data) => setCampaigns({ campaigns: data }));
  }

  useEffect(() => {
    googleAuthSession && getPausedCampaigns();
  }, [googleAuthSession]);

  return (
    <GoogleAuthLayout>
      <details className="mb-4">
        <summary>Campaigns</summary>
        <pre>
          <code>{JSON.stringify(campaigns, null, 2)}</code>
        </pre>
      </details>
    </GoogleAuthLayout>
  );
}
