import LoginButton from "@/components/login-btn";
import MainLayout from "@/layouts/main";

export default function Home() {
  return (
    <MainLayout>
      <h1 className="text-xl font-medium mb-4">Log in with Facebook</h1>
      <LoginButton />
    </MainLayout>
  );
}
