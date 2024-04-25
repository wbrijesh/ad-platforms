import LoginButton from "@/components/login-btn";
import AuthLayout from "@/layouts/main";

export default function Home() {
  return (
    <AuthLayout>
      <h1 className="text-xl font-medium mb-4">Log in with Facebook</h1>
      <LoginButton />
    </AuthLayout>
  );
}
