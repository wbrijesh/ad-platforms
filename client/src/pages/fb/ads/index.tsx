import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FacebookPageLayout from "@/components/facebook-page-layout";
import { GetCookie } from "@/lib/cookies";
import { useRouter } from "next/router";

export default function Index() {
  const { data: session } = useSession();

  const router = useRouter();

  const [ads, setAds] = useState([]);

  let adAccountId = GetCookie("ad_account_id");
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
        <h1 className="text-xl font-medium mb-4">List Ads</h1>
        <button
          className="bg-slate-700 hover:bg-slate-800 text-white font-semibold text-sm py-1.5 px-2 rounded"
          onClick={() => router.push("/fb/ads/new")}
        >
          New Ad
        </button>
      </div>
      {session && (
        <>
          {GetCookie("ad_account_id") && (
            <>
              {ads && (
                <details>
                  <summary>Ads</summary>
                  <pre>{JSON.stringify(ads, null, 2)}</pre>{" "}
                </details>
              )}
            </>
          )}
        </>
      )}
    </FacebookPageLayout>
  );
}
