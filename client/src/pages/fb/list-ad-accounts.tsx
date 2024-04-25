import AuthLayout from "@/layouts/main";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ListAdAccountsPage() {
  const { data: session } = useSession();

  const access_token =
    session && JSON.parse(JSON.stringify(session))?.accessToken;

  const [adAccounts, setAdAccounts] = useState<any>([]);

  function getAdAccounts() {
    fetch(
      `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_id&access_token=${access_token}`,
    )
      .then((response) => response && response.json())
      .then((data) => setAdAccounts(data.data));
  }

  return (
    <AuthLayout>
      {session && (
        <>
          <h1 className="text-xl font-medium mb-4">List of Ad Accounts</h1>

          <button
            className="mb-4 px-2 py-1 rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={() => getAdAccounts()}
          >
            Load Ad Accounts
          </button>

          {adAccounts.length > 0 && (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border">ID</th>
                  <th className="border">Name</th>
                  <th className="border">Account ID</th>
                </tr>
              </thead>
              <tbody>
                {adAccounts.map((account: any) => (
                  <tr key={account.id}>
                    <td className="border">{account.id}</td>
                    <td className="border">{account.name}</td>
                    <td className="border">{account.account_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </AuthLayout>
  );
}
