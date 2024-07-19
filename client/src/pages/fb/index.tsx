import FacebookPageLayout from "@/components/facebook-page-layout";
import FbLoginButton from "@/components/login-btn";
import AuthLayout from "@/layouts/main";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <FacebookPageLayout>
      <div
        className="flex items-center justify-center flex-col"
        style={{ height: "calc(100vh - 100px)" }}
      >
        {!session ? (
          <>
            <h1 className="text-lg font-medium">Account not linked</h1>
            <p className="mt-2 mb-4">
              To use Ads Platform, please link your Facebook account.
            </p>
            <FbLoginButton />
          </>
        ) : (
          <>
            <h1 className="text-lg font-medium">Facebook Ads</h1>
            <p className="mt-2 mb-4">Welcome to the Facebook Ads Platform.</p>
          </>
        )}
      </div>
    </FacebookPageLayout>
  );
}
