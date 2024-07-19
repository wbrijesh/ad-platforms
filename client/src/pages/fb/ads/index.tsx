import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FacebookPageLayout from "@/components/facebook-page-layout";
import { useRouter } from "next/router";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Index() {
  const { data: session } = useSession();

  const router = useRouter();

  const [ads, setAds] = useState([]);

  const [adAccountId, setAdAccountId] = useState<string | null>(null);

  useEffect(() => {
    setAdAccountId(localStorage.getItem("ad_account_id"));
  }, []);

  let mySession: any = session;
  let accessToken = mySession?.accessToken;

  async function getAllAds(adAccountId: string, accessToken: string) {
    const url = `https://graph.facebook.com/v19.0/${adAccountId}/ads?fields=id,name,adset_id,creative,ad_status&access_token=${accessToken}`;

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
      console.error("Failed to fetch ads:", error);
      return null;
    }
  }

  useEffect(() => {
    if (adAccountId && accessToken) {
      getAllAds(adAccountId, accessToken).then((data) => {
        setAds(data);
      });
    }
  }, [adAccountId, accessToken]);

  return (
    <FacebookPageLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium mb-4">Ads</h1>
        <button
          className="bg-slate-700 hover:bg-slate-800 text-white font-semibold text-sm py-1.5 px-2 rounded"
          onClick={() => router.push("/fb/ads/new")}
        >
          New Ad
        </button>
      </div>
      {session && (
        <>
          {adAccountId && (
            <>
              {ads ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Adset Id</TableHead>
                      <TableHead>Creative Id</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ads.map((ad: any) => (
                      <TableRow key={ad.id}>
                        <TableCell>{ad.id}</TableCell>
                        <TableCell>{ad.name}</TableCell>
                        <TableCell>{ad.adset_id}</TableCell>
                        <TableCell>{ad.creative.id}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-xl font-medium mb-4 text-slate-700">
                  No ads found
                </p>
              )}
            </>
          )}
        </>
      )}
    </FacebookPageLayout>
  );
}
