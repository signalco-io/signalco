import { useAuth } from "react-use-auth";
import { useRouter } from "next/router";
import Login from "../components/Login";
import { useState, useEffect } from "react";

export default function Index() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => setIsLoading(false), []);

  if (isLoading) return null;

  if (isAuthenticated()) {
    router.push("/home", "/home");
    return null;
  } else {
    return <Login />;
  }
}
