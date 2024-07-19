import AuthLayout from "@/layouts/main";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FacebookPageLayout from "@/components/facebook-page-layout";
import { GetCookie } from "@/lib/cookies";
import { useRouter } from "next/router";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

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

  async function getCampaignDetails(adAccountId: any, accessToken: any) {
    const url = `https://graph.facebook.com/v19.0/act_${adAccountId}/campaigns?fields=id,name,status,objective,created_time,updated_time&access_token=${accessToken}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.error.message}`);
      }

      const data = await response.json();
      return data.data; // Facebook Graph API returns data in the 'data' field
    } catch (error) {
      console.error("Failed to fetch campaign details:", error);
      return null;
    }
  }

  // const adAccountId = GetCookie("ad_account_id");
  // const accessToken = mySession && mySession.accessToken;
  //
  // const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  // const [campaignDetails, setCampaignDetails] = useState<any>();

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
          {/* {GetCookie("ad_account_id") && ( */}
          <>
            {/* <Select */}
            {/*   value={selectedCampaignId} */}
            {/*   onValueChange={(value) => setSelectedCampaignId(value)} */}
            {/* > */}
            {/*   <SelectTrigger className="w-[180px]"> */}
            {/*     <SelectValue placeholder="Select Campaign" /> */}
            {/*   </SelectTrigger> */}
            {/*   <SelectContent> */}
            {/*     {activeCampaigns && */}
            {/*       activeCampaigns.map((campaign: any) => ( */}
            {/*         <SelectItem key={campaign.id} value={campaign.id}> */}
            {/*           {campaign.name} */}
            {/*         </SelectItem> */}
            {/*       ))} */}
            {/*     {archivedCampaigns && */}
            {/*       archivedCampaigns.map((campaign: any) => ( */}
            {/*         <SelectItem key={campaign.id} value={campaign.id}> */}
            {/*           {campaign.name} */}
            {/*         </SelectItem> */}
            {/*       ))} */}
            {/*     {pausedCampaigns && */}
            {/*       pausedCampaigns.map((campaign: any) => ( */}
            {/*         <SelectItem key={campaign.id} value={campaign.id}> */}
            {/*           {campaign.name} */}
            {/*         </SelectItem> */}
            {/*       ))} */}
            {/*   </SelectContent> */}
            {/* </Select> */}
            {/**/}
            {/* <button */}
            {/*   className="bg-slate-700 hover:bg-slate-800 text-white font-semibold text-sm py-1.5 px-2 rounded" */}
            {/*   onClick={() => { */}
            {/*     // getCampaignDetails(selectedCampaignId, accessToken).then( */}
            {/*     //   (data) => { */}
            {/*     //     setCampaignDetails(data); */}
            {/*     //   }, */}
            {/*     // ); */}
            {/*     setCampaignDetails( */}
            {/*       getCampaignDetails(selectedCampaignId, accessToken), */}
            {/*     ); */}
            {/*   }} */}
            {/* > */}
            {/*   Get Campaign Details */}
            {/* </button> */}
            {/**/}
            {/* {campaignDetails && ( */}
            {/*   <details> */}
            {/*     <summary>Campaign Details</summary> */}
            {/*     <pre>{JSON.stringify(campaignDetails, null, 2)}</pre> */}
            {/*   </details> */}
            {/* )} */}

            {!activeCampaigns && !archivedCampaigns && !pausedCampaigns && (
              <p>Loading campaigns</p>
            )}

            {(activeCampaigns || archivedCampaigns || pausedCampaigns) && (
              <Table className="mt-2">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* <TableRow> */}
                  {/*   <TableCell className="font-medium">INV001</TableCell> */}
                  {/*   <TableCell>Paid</TableCell> */}
                  {/*   <TableCell>Credit Card</TableCell> */}
                  {/*   <TableCell className="text-right">$250.00</TableCell> */}
                  {/* </TableRow> */}

                  {activeCampaigns &&
                    activeCampaigns.map((campaign: any) => (
                      <TableRow key={campaign.id}>
                        <TableCell>{campaign.name}</TableCell>
                        <TableCell>{campaign.status}</TableCell>
                        <TableCell>{campaign.id}</TableCell>
                      </TableRow>
                    ))}

                  {archivedCampaigns &&
                    archivedCampaigns.map((campaign: any) => (
                      <TableRow key={campaign.id}>
                        <TableCell>{campaign.name}</TableCell>
                        <TableCell>{campaign.status}</TableCell>
                        <TableCell>{campaign.id}</TableCell>
                      </TableRow>
                    ))}

                  {pausedCampaigns &&
                    pausedCampaigns.map((campaign: any) => (
                      <TableRow key={campaign.id}>
                        <TableCell>{campaign.name}</TableCell>
                        <TableCell>{campaign.status}</TableCell>
                        <TableCell>{campaign.id}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </>
          {/* )} */}
        </>
      )}
    </FacebookPageLayout>
  );
}
