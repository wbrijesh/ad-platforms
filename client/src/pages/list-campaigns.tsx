import MainLayout from "@/layouts/main";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ListCampaigns() {
  const { data: session } = useSession();

  const [activeCampaigns, setActiveCampaigns] = useState<any>();
  const [archivedCampaigns, setArchivedCampaigns] = useState<any>();
  const [pausedCampaigns, setPausedCampaigns] = useState<any>();

  const access_token =
    session && JSON.parse(JSON.stringify(session))?.accessToken;

  function getActiveCampaigns() {
    fetch(
      `https://graph.facebook.com/v12.0/${localStorage.getItem(
        "ad_account_id"
      )}/campaigns?fields=name&access_token=${access_token}`
    )
      .then((response) => response.json())
      .then((data) => setActiveCampaigns({ campaigns: data }));
  }

  function getArchivedCampaigns() {
    fetch(
      `https://graph.facebook.com/v12.0/${localStorage.getItem(
        "ad_account_id"
      )}/campaigns?fields=name,effective_status&access_token=${access_token}&filtering=[{'field':'effective_status','operator':'IN','value':['ARCHIVED']}]`
    )
      .then((response) => response.json())
      .then((data) => setArchivedCampaigns({ campaigns: data }));
  }

  function getPausedCampaigns() {
    fetch(
      `https://graph.facebook.com/v12.0/${localStorage.getItem(
        "ad_account_id"
      )}/campaigns?fields=name,effective_status&access_token=${access_token}&filtering=[{'field':'effective_status','operator':'IN','value':['PAUSED']}]`
    )
      .then((response) => response.json())
      .then((data) => setPausedCampaigns({ campaigns: data }));
  }

  const [adAccounts, setAdAccounts] = useState<any>([]);

  function getAdAccounts() {
    fetch(
      `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_id&access_token=${access_token}`
    )
      .then((response) => response.json())
      .then((data) => setAdAccounts(data.data));
  }

  return (
    <MainLayout>
      {session && (
        <>
          {localStorage.getItem("ad_account_id") && (
            <>
              <button
                className="mb-4 px-2 py-1 rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition"
                onClick={getActiveCampaigns}
              >
                Get Active Campaigns
              </button>

              <br />

              <button
                className="mb-4 px-2 py-1 rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition"
                onClick={getArchivedCampaigns}
              >
                Get Archived Campaigns
              </button>

              <br />

              <button
                className="mb-4 px-2 py-1 rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition"
                onClick={getPausedCampaigns}
              >
                Get Paused Campaigns
              </button>

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
    </MainLayout>
  );
}
