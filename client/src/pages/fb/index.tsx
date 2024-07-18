import LoginButton from "@/components/login-btn";
import AuthLayout from "@/layouts/main";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <AuthLayout>
      <h1 className="text-xl font-medium mb-4">Log in with Facebook</h1>
      <LoginButton />
    </AuthLayout>
  );
}
