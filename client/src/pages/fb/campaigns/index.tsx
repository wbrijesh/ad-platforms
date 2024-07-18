import AuthLayout from "@/layouts/main";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FacebookPageLayout from "@/components/facebook-page-layout";
import { GetCookie } from "@/lib/cookies";
import { useRouter } from "next/router";

export default function Index() {
  const { data: session } = useSession();

  const router = useRouter();

  const [activeCampaigns, setActiveCampaigns] = useState<any>();
  const [archivedCampaigns, setArchivedCampaigns] = useState<any>();
  const [pausedCampaigns, setPausedCampaigns] = useState<any>();

  const [mySession, setMySession] = useState<any>();
  useEffect(() => {
    session && setMySession(session);
  }, [session]);

  function getActiveCampaigns() {
    fetch(
      `https://graph.facebook.com/v19.0/${GetCookie("ad_account_id")}/campaigns?fields=id,name,status&effective_status=['ACTIVE']&access_token=${mySession.accessToken}`,
    )
      .then((response) => response.json())
      .then((data) => setActiveCampaigns(data.data));
  }

  function getArchivedCampaigns() {
    fetch(
      `https://graph.facebook.com/v19.0/${GetCookie("ad_account_id")}/campaigns?fields=id,name,status&effective_status=["ARCHIVED"]&access_token=${mySession.accessToken}`,
    )
      .then((response) => response.json())
      .then((data) => setArchivedCampaigns(data.data));
  }

  function getPausedCampaigns() {
    fetch(
      `https://graph.facebook.com/v19.0/${GetCookie("ad_account_id")}/campaigns?fields=id,name,status&effective_status=["PAUSED"]&access_token=${mySession.accessToken}`,
    )
      .then((response) => response.json())
      .then((data) => setPausedCampaigns(data.data));
  }

  function GetAllCampaigns() {
    mySession && mySession.accessToken && getActiveCampaigns();
    mySession && mySession.accessToken && getArchivedCampaigns();
    mySession && mySession.accessToken && getPausedCampaigns();
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
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium mb-4">Campaigns</h1>
            <button
              className="bg-slate-700 hover:bg-slate-800 text-white font-semibold text-sm py-1.5 px-2 rounded"
              onClick={() => router.push("/fb/campaigns/new")}
            >
              New Campaign
            </button>
          </div>
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
