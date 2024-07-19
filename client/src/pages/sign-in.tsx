import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { v4 } from "uuid";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SetCookie } from "@/lib/cookies";

type Inputs = {
  email: string;
  password: string;
};

type UserObject = {
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role?: string;
  verified?: boolean;
};

type SignInResponseType = {
  success: string;
  message: string;
  token: string;
};

const UserSignInPage = () => {
  const [registrationResponse, setRegistrationResponse] =
    useState<SignInResponseType>();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  function sendSignInRequest(user: UserObject) {
    // fetch("http://localhost:4000/v1/signin", {
    fetch("https://ads.brijesh.dev/api/v1/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        setRegistrationResponse(data);
      })
      .catch((error) => console.error("error:", error));
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    let user: UserObject = {
      email: data.email,
      password: data.password,
    };

    sendSignInRequest(user);
  };

  useEffect(() => {
    if (registrationResponse?.success == "true") {
      localStorage.setItem("ad_platforms_token", registrationResponse.token);
      SetCookie("ad_platforms_token", registrationResponse.token, 86400);
      router.push("/");
    } else if (registrationResponse?.message) {
      alert(registrationResponse.message);
    }
  }, [registrationResponse]);

  return (
    <div className="h-[100vh] bg-slate-100 flex items-center justify-center">
      <div className="w-[500px] bg-white border shadow border-slate-200 p-8 rounded-xl">
        <h1 className="text-2xl font-medium text-center mb-8">
          Sign in to your account
        </h1>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="border border-slate-300 shadow-sm p-1 outline-none focus:border-slate-500"
            type="email"
            placeholder="email"
            {...register("email")}
          />
          <pre>You entered password: {watch("password")}</pre>
          <input
            className="border border-slate-300 shadow-sm p-1 outline-none focus:border-slate-500"
            type="password"
            placeholder="password"
            {...register("password")}
          />

          {errors && JSON.stringify(errors) !== "{}" && (
            <pre>{JSON.stringify(errors, null, 2)}</pre>
          )}

          <button
            className="mt-5 p-1 bg-blue-500 text-white px-1.5 py-2 rounded transition hover:bg-blue-600 hover:shadow-lg duration-300"
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="text-center text-slate-500 mt-5">
          Don{"'"}t have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserSignInPage;
