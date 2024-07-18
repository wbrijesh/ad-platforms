import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { GetCookie, SetCookie } from "@/lib/cookies";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/router";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import AuthLayout from "@/layouts/main";
import LoginButton from "@/components/login-btn";

const FacebookPageLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [adAccounts, setAdAccounts] = useState<any>([]);

  const [selectedAdAccountId, setSelectedAdAccountId] = useState<string>("");

  const [mySession, setMySession] = useState<any>(null);

  useEffect(() => {
    setMySession(session);
  }, [session]);

  // function getAdAccounts() {
  //   !mySession.access_token && router.push("/fb/authenticate");
  //
  //   fetch("http://localhost:4000/v1/fb/ad-accounts", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + GetCookie("ad_platforms_token"),
  //       access_token: mySession && mySession.access_token,
  //     },
  //   })
  //     .then((response) => response && response.json())
  //     .then((data) => setAdAccounts(data.ad_accounts.data));
  // }

  function getAdAccounts() {
    !mySession.accessToken && router.push("/fb/authenticate");

    fetch(
      `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_id&access_token=${mySession.accessToken}`,
    )
      .then((response) => response.json())
      .then((data: any) => {
        localStorage.setItem("fb_ad_accounts", JSON.stringify(data.data));
        console.log("accounts:", data.data);
        setAdAccounts(data.data);
      });
  }

  // on page load wait for one second and then call getAdAccounts
  useEffect(() => {
    mySession && mySession.accessToken !== undefined && getAdAccounts();
  }, [mySession]);

  useEffect(() => {
    selectedAdAccountId &&
      SetCookie("ad_account_id", selectedAdAccountId, 86400);
  }, [selectedAdAccountId]);

  useEffect(() => {
    GetCookie("ad_account_id") &&
      setSelectedAdAccountId(GetCookie("ad_account_id") || "");
  }, []);

  // set selected account id in local storage
  useEffect(() => {
    selectedAdAccountId &&
      localStorage.setItem("ad_account_id", selectedAdAccountId);
  }, [selectedAdAccountId]);

  // if there is a session save access token in cookie, else remove the cookie
  useEffect(() => {
    if (mySession) {
      SetCookie(
        "access_token",
        (mySession && mySession.accessToken) || "",
        86400,
      );
    } else {
      SetCookie("access_token", "", 0);
    }
  }, [mySession]);

  // in a use effect find value of ad account id in local storage and log it
  useEffect(() => {
    console.log("ad_account_id: ", localStorage.getItem("ad_account_id"));
  }, []);

  return (
    <AuthLayout>
      {!session && (
        <div className="m-5">
          <LoginButton />
        </div>
      )}
      {session && (
        <>
          <div className="flex items-center justify-between px-5 py-3 border-b border-ds-zinc-250 shadow-ds-zinc-150">
            <p className="text-base text-semibold text-zinc-900">
              Facebook Ads
            </p>
            {(adAccounts && adAccounts.length > 0) ||
            localStorage.getItem("ad_account_id") !== null ? (
              <div>
                <Select
                  value={
                    selectedAdAccountId ||
                    localStorage.getItem("ad_account_id") ||
                    ""
                  }
                  onValueChange={setSelectedAdAccountId}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select an Ad Account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {adAccounts.map((account: any) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} - {account.account_id}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <>
                <div>
                  <span>Loading Ad Accounts...</span>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {session &&
        (selectedAdAccountId ? (
          <div className="m-5">{children}</div>
        ) : (
          <div className="flex flex-col gap-0 items-center justify-center h-[90vh]">
            <pre>
              <code>{JSON.stringify(adAccounts, null, 2)}</code>
            </pre>
            <button onClick={getAdAccounts}>Get Ad Accounts</button>
            <MagnifyingGlassIcon className="h-14 w-14 text-zinc-400" />
            <p className="text-lg text-semibold text-ds-zinc-900">
              Please select an Ad Account
            </p>
          </div>
        ))}
    </AuthLayout>
  );
};

export default FacebookPageLayout;
