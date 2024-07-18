import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const FacebookAuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const [adAccounts, setAdAccounts] = useState<any>([]);

  const router = useRouter();

  const isFacebookRoute = router.pathname.startsWith("/fb");

  const { data: session } = useSession();
  const access_token =
    session && JSON.parse(JSON.stringify(session))?.accessToken;

  // function getAdAccounts() {
  //   fetch(
  //     `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_id&access_token=${access_token}`,
  //   )
  //     .then((response) => response && response.json())
  //     .then((data) => setAdAccounts(data.data));
  // }
  //
  // useEffect(() => {
  //   isFacebookRoute && session && access_token && getAdAccounts();
  // }, [session, access_token, isFacebookRoute]);
  //
  // useEffect(() => {
  //   if (!isFacebookRoute) {
  //     router.push("/");
  //   }
  // }, [session, isFacebookRoute]);

  return (
    <>
      <>{children}</>
    </>
  );
};

export default FacebookAuthWrapper;
