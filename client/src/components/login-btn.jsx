import { useSession, signIn, signOut } from "next-auth/react";

const FbLoginButton = () => {
  const { data: session } = useSession();

  if (session) {
    return;
  }

  return (
    <div className="mb-4">
      <button
        className="px-2 py-1.5 rounded-sm bg-slate-700 text-white hover:bg-slate-800 transition text-sm font-medium"
        onClick={() => signIn("facebook_business")}
      >
        Link Facebook Business Account
      </button>
    </div>
  );
};

export default FbLoginButton;
