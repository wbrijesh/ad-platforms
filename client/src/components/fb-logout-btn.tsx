import { useSession, signIn, signOut } from "next-auth/react";

const FbLogoutButton = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="mb-4">
        <button
          className="px-2 py-1.5 rounded-sm bg-slate-700 text-white hover:bg-slate-800 transition text-sm font-medium"
          onClick={() => signOut()}
        >
          Unlink Facebook Business Account
        </button>
        <br />
      </div>
    );
  }
  return;
};

export default FbLogoutButton;
