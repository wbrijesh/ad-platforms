import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { GetCookie } from "@/lib/cookies";
import FacebookAuthWrapper from "@/layouts/fb_auth";
import SidebarLayout from "@/layouts/sidebar_layout";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [adPlatformsToken, setAdPlatformsToken] = useState<string>("");

  const router = useRouter();

  const isFacebookRoute = router.pathname.startsWith("/fb");

  const { data: session } = useSession();
  const access_token =
    session && JSON.parse(JSON.stringify(session))?.accessToken;

  function getAdAccounts() {
    fetch(
      `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_id&access_token=${access_token}`,
    )
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("fb_ad_accounts", JSON.stringify(data.data));
      });
  }

  useEffect(() => {
    access_token && getAdAccounts();
  }, [access_token]);

  useEffect(() => {
    setAdPlatformsToken(GetCookie("ad_platforms_token") || "");
  }, [session, access_token]);

  return (
    <Fragment>
      {adPlatformsToken ||
      router.pathname == "/register" ||
      router.pathname == "/sign-in" ? (
        <SidebarLayout adPlatformsToken={adPlatformsToken}>
          {isFacebookRoute ? (
            <FacebookAuthWrapper>{children}</FacebookAuthWrapper>
          ) : (
            <>{children}</>
          )}
        </SidebarLayout>
      ) : (
        <Fragment>
          <p className="mb-5">Please sign in to access this page</p>
          <button
            className="bg-blue-500 px-[8px] py-[5px] rounded transition duration-300 hover:bg-blue-600 text-white"
            onClick={() => router.push("/sign-in")}
          >
            Sign In
          </button>
        </Fragment>
      )}
    </Fragment>
  );
};

export default AuthLayout;

// <div className="transition fixed top-0 start-0 bottom-0 z-[60] w-72 border-r border-gray-500 p-5">
//   <nav className="hs-accordion-group w-full flex flex-col flex-wrap">
//     <ul className="space-y-1">
//       <li>
//         <Link className="hover:underline" href="/">
//           Log in with Facebook
//         </Link>
//       </li>
//       <li>
//         <Link className="hover:underline" href="/list-ad-accounts">
//           List Ad Accounts
//         </Link>
//       </li>
//       <li>
//         <Link className="hover:underline" href="/list-campaigns">
//           List All Campaigns
//         </Link>
//       </li>
//       <li>
//         <Link className="hover:underline" href="/new-campaign">
//           Create New Campaign
//         </Link>
//       </li>
//       <li>
//         <Link className="hover:underline" href="/new-adset">
//           Create New Ad Set for Campaign
//         </Link>
//       </li>
//       <li>
//         <Link className="hover:underline" href="/new-image">
//           Upload Image for Ad Creative
//         </Link>
//       </li>
//       <li>
//         <Link className="hover:underline" href="/new-ad">
//           Create New Ad for Ad Set
//         </Link>
//       </li>
//     </ul>
//   </nav>
// </div>
