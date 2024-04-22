import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const access_token =
    session && JSON.parse(JSON.stringify(session))?.accessToken;

  const router = useRouter();

  const [adAccounts, setAdAccounts] = useState<any>([]);
  const [ad_account_id, set_ad_account_id] = useState<any>();

  function getAdAccounts() {
    fetch(
      `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_id&access_token=${access_token}`
    )
      .then((response) => response.json())
      .then((data) => setAdAccounts(data.data));
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      getAdAccounts();
    }, 2000);
  }, []);

  // whenever ad_account_id changes set a local storage item to persist the selection
  useEffect(() => {
    localStorage.setItem(
      "ad_account_id",
      ad_account_id ? ad_account_id : localStorage.getItem("ad_account_id")
    );
  }, [ad_account_id]);

  // wait for page load and then set the ad_account_id from local storage
  useEffect(() => {
    if (router.pathname !== "/") {
      !ad_account_id &&
        localStorage.getItem("ad_account_id") &&
        set_ad_account_id(localStorage.getItem("ad_account_id"));
    }
  }, [router.pathname]);

  return (
    <>
      <div className="flex">
        <div className="transition fixed top-0 start-0 bottom-0 z-[60] w-72 border-r border-gray-500 p-5">
          <nav className="hs-accordion-group w-full flex flex-col flex-wrap">
            <ul className="space-y-1">
              <li>
                <Link className="hover:underline" href="/">
                  Log in with Facebook
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/list-ad-accounts">
                  List Ad Accounts
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/list-campaigns">
                  List All Campaigns
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/new-campaign">
                  Create New Campaign
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/new-adset">
                  Create New Ad Set for Campaign
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/new-image">
                  Upload Image for Ad Creative
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/new-ad">
                  Create New Ad for Ad Set
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="ml-72 block w-[calc(100vw-288px)] overflow-auto">
          {router.pathname == "/" ? (
            children
          ) : (
            <>
              {session ? (
                <>
                  {(!localStorage.getItem("ad_account_id") ||
                    localStorage.getItem("ad_account_id") == "undefined") && (
                      <div className="w-full flex items-center border-b border-gray-400">
                        <div className="my-3 mx-2">
                          <Select
                            value={ad_account_id}
                            onValueChange={(value) =>
                              value && set_ad_account_id(value)
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select a Ad Account" />
                            </SelectTrigger>
                            <SelectContent>
                              {adAccounts &&
                                adAccounts.map((account: any) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  <div className="p-5">
                    {ad_account_id
                      ? children
                      : "Please select an Ad Account to view this page"}
                  </div>
                </>
              ) : (
                <div>
                  Please{" "}
                  <Link className="text-blue-600 underline" href="/">
                    Log in
                  </Link>{" "}
                  to view this page.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MainLayout;
