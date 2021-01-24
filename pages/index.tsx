import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Login from "../components/Login";

const Onboarding = () => {
  return (
    <>
    </>
  );
};

export default function Index() {
  const { isAuthenticated, isLoading, error } = useAuth0();
  const router = useRouter();

  if (isAuthenticated)
    router.push("/dashboard");

  useEffect(() => {
    if (isAuthenticated)
      router.push("/dashboard");
  }, [isAuthenticated]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!isAuthenticated) return <Login />;
  return <div>Redirecting...</div>;
}
