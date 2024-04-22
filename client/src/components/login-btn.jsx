import { useSession, signIn, signOut } from "next-auth/react";

const LoginButton = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="mb-4">
        <details className="mb-4">
          <summary>Account Details</summary>
          <pre className="mb-4">{JSON.stringify(session, null, 2)}</pre>
        </details>
        <button
          className="px-2 py-1 rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition"
          onClick={() => signOut()}
        >
          Sign out
        </button>
        <br />
      </div>
    );
  }
  return (
    <div className="mb-4">
      <button
        className="px-2 py-1 rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </div>
  );
};

export default LoginButton;
