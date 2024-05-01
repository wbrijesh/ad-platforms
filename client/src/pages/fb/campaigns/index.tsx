import AuthLayout from "@/layouts/main";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FacebookPageLayout from "@/components/facebook-page-layout";
import { GetCookie } from "@/lib/cookies";

export default function Index() {
  const { data: session } = useSession();

  const [activeCampaigns, setActiveCampaigns] = useState<any>();
  const [archivedCampaigns, setArchivedCampaigns] = useState<any>();
  const [pausedCampaigns, setPausedCampaigns] = useState<any>();

  const [mySession, setMySession] = useState<any>();
  useEffect(() => {
    session && setMySession(session);
  }, [session]);

  function getActiveCampaigns() {
    fetch(`http://localhost:4000/v1/fb/campaigns-active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GetCookie("ad_platforms_token"),
        access_token: mySession && mySession.access_token,
        ad_account_id: GetCookie("ad_account_id") || "",
      },
    })
      .then((response) => response.json())
      .then((data) => setActiveCampaigns({ campaigns: data }));
  }

  function getArchivedCampaigns() {
    fetch(`http://localhost:4000/v1/fb/campaigns-archived`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GetCookie("ad_platforms_token"),
        access_token: mySession && mySession.access_token,
        ad_account_id: GetCookie("ad_account_id") || "",
      },
    })
      .then((response) => response.json())
      .then((data) => setArchivedCampaigns({ campaigns: data }));
  }

  function getPausedCampaigns() {
    fetch(`http://localhost:4000/v1/fb/campaigns-paused`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + GetCookie("ad_platforms_token"),
        access_token: mySession && mySession.access_token,
        ad_account_id: GetCookie("ad_account_id") || "",
      },
    })
      .then((response) => response.json())
      .then((data) => setPausedCampaigns({ campaigns: data }));
  }

  function GetAllCampaigns() {
    mySession && mySession.access_token && getActiveCampaigns();
    mySession && mySession.access_token && getArchivedCampaigns();
    mySession && mySession.access_token && getPausedCampaigns();
  }

  const [secondsSincePageLoad, setSecondsSincePageLoad] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsSincePageLoad((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (secondsSincePageLoad > 0) {
      !activeCampaigns &&
        !archivedCampaigns &&
        !pausedCampaigns &&
        GetAllCampaigns();
    }
  }, [secondsSincePageLoad]);

  return (
    <FacebookPageLayout>
      {session && (
        <>
          {GetCookie("ad_account_id") && (
            <>
              {!activeCampaigns && !archivedCampaigns && !pausedCampaigns && (
                <p>Loading campaigns</p>
              )}

              {activeCampaigns && (
                <details className="mb-4">
                  <summary>Active Campaigns Details</summary>

                  <pre className="mb-4">
                    {JSON.stringify(activeCampaigns, null, 2)}
                  </pre>
                </details>
              )}

              {archivedCampaigns && (
                <details className="mb-4">
                  <summary>Archived Campaigns Details</summary>
                  <pre className="mb-4">
                    {JSON.stringify(archivedCampaigns, null, 2)}
                  </pre>
                </details>
              )}

              {pausedCampaigns && (
                <details className="mb-4">
                  <summary>Paused Campaigns Details</summary>
                  <pre className="mb-4">
                    {JSON.stringify(pausedCampaigns, null, 2)}
                  </pre>
                </details>
              )}
            </>
          )}
        </>
      )}
    </FacebookPageLayout>
  );
}
