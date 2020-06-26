import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import Login from "../components/Login";

export default function Index() {
  const { isAuthenticated, isLoading, error } = useAuth0();
  const router = useRouter();

  if (isLoading) return null;
  if (error) {
    return <div>{error.message}</div>;
  }

  if (isAuthenticated) {
    router.push("/home", "/home");
    return null;
  } else {
    return <Login />;
  }
}
