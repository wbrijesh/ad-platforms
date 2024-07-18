import { useSession } from "next-auth/react";
import FacebookPageLayout from "@/components/facebook-page-layout";
import { useState, useEffect } from "react";
import { GetCookie } from "@/lib/cookies";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/router";

const AdsetsTable = ({ adsets }: any) => {
  return (
    <div className="container mx-auto">
      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Campaign ID</th>
              <th className="py-3 px-6 text-left">Adset ID</th>
              <th className="py-3 px-6 text-left">Adset Name</th>
              <th className="py-3 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {adsets.map((campaign: any) =>
              campaign.adsets.length === 0 ? (
                <tr
                  key={campaign.campaignId}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {campaign.campaignId}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">-</td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">-</td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">-</td>
                </tr>
              ) : (
                campaign.adsets.map((adset: any) => (
                  <tr
                    key={adset.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {campaign.campaignId}
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {adset.id}
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {adset.name}
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {adset.status}
                    </td>
                  </tr>
                ))
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function Home() {
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

  const [adSets, setAdSets] = useState<any[]>([]);

  function getAdsetsForCampaign(campaignId: string) {
    const accessToken = mySession.accessToken;
    const url = `https://graph.facebook.com/v19.0/${campaignId}/adsets?fields=id,name,status&access_token=${accessToken}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) =>
        setAdSets((prev) => [
          ...prev,
          { campaignId: campaignId, adsets: data.data },
        ]),
      );
  }

  // useEffect(() => {
  //   if (activeCampaigns) {
  //     activeCampaigns.forEach((campaign: any) => {
  //       getAdsetsForCampaign(campaign.id);
  //     });
  //   }
  //   if (archivedCampaigns) {
  //     archivedCampaigns.forEach((campaign: any) => {
  //       getAdsetsForCampaign(campaign.id);
  //     });
  //   }
  //   if (pausedCampaigns) {
  //     pausedCampaigns.forEach((campaign: any) => {
  //       getAdsetsForCampaign(campaign.id);
  //     });
  //   }
  // }, [activeCampaigns, archivedCampaigns, pausedCampaigns]);

  const [selectedCampaign, setSelectedCampaign] = useState<string>("");

  return (
    <FacebookPageLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium mb-4">List AdSets</h1>
        <button
          className="bg-slate-700 hover:bg-slate-800 text-white font-semibold text-sm py-1.5 px-2 rounded"
          onClick={() => router.push("/fb/adsets/new")}
        >
          New AdSet
        </button>
      </div>

      {session && (
        <>
          <form>
            <Select
              value={selectedCampaign}
              onValueChange={(value) => setSelectedCampaign(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Campaign" />
              </SelectTrigger>
              <SelectContent>
                {activeCampaigns &&
                  activeCampaigns.map((campaign: any) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                {archivedCampaigns &&
                  archivedCampaigns.map((campaign: any) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                {pausedCampaigns &&
                  pausedCampaigns.map((campaign: any) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={() => getAdsetsForCampaign(selectedCampaign)}
              className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1.5 px-2 rounded mt-2"
            >
              Get Adsets for Campaign
            </button>
          </form>

          {adSets.length > 0 && <pre>{JSON.stringify(adSets, null, 2)}</pre>}
        </>
      )}
    </FacebookPageLayout>
  );
}
