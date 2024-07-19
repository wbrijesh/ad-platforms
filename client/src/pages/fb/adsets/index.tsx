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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdsetsTable = ({ adsets }: any) => {
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Campaign</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {adsets.map((campaign: any) =>
          campaign.adsets.length === 0 ? (
            <TableRow key={campaign.campaignId}>
              <TableCell>{campaign.campaignId}</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          ) : (
            campaign.adsets.map((adset: any) => (
              <TableRow key={adset.id}>
                <TableCell>{adset.name}</TableCell>
                <TableCell>{adset.status}</TableCell>
                <TableCell>{adset.id}</TableCell>
                <TableCell>{campaign.campaignId}</TableCell>
              </TableRow>
            ))
          ),
        )}
      </TableBody>
    </Table>
  );
};

const CampaignSelect = ({
  selectedCampaign,
  activeCampaigns,
  pausedCampaigns,
  archivedCampaigns,
  setSelectedCampaign,
}: any) => {
  return (
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

  useEffect(() => {
    selectedCampaign && getAdsetsForCampaign(selectedCampaign);
  }, [selectedCampaign]);

  return (
    <FacebookPageLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium mb-4">AdSets</h1>
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
            {!selectedCampaign ? (
              <div className="flex flex-col items-center justify-center h-[80vh]">
                <p className="text-xl font-medium mb-4 text-slate-700">
                  Select a campaign to view adsets
                </p>
                <CampaignSelect
                  selectedCampaign={selectedCampaign}
                  activeCampaigns={activeCampaigns}
                  pausedCampaigns={pausedCampaigns}
                  archivedCampaigns={archivedCampaigns}
                  setSelectedCampaign={setSelectedCampaign}
                />
              </div>
            ) : (
              <>
                <div className="flex justify-end mt-4">
                  <label className="block text-sm text-slate-700 mb-2">
                    Selected Campaign
                  </label>
                </div>
                <div className="flex justify-end">
                  <CampaignSelect
                    selectedCampaign={selectedCampaign}
                    activeCampaigns={activeCampaigns}
                    pausedCampaigns={pausedCampaigns}
                    archivedCampaigns={archivedCampaigns}
                    setSelectedCampaign={setSelectedCampaign}
                  />
                </div>
              </>
            )}

            {/* <button */}
            {/*   type="button" */}
            {/*   onClick={() => getAdsetsForCampaign(selectedCampaign)} */}
            {/*   className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1.5 px-2 rounded mt-2" */}
            {/* > */}
            {/*   Get Adsets for Campaign */}
            {/* </button> */}
          </form>

          {adSets.length > 0 && <AdsetsTable adsets={adSets} />}
        </>
      )}
    </FacebookPageLayout>
  );
}
