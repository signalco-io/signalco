import { useAuth } from "react-use-auth";
import { useRouter } from "next/router";
import Login from "../components/Login";

export default function Index() {
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();

  if (isAuthenticated()) {
    router.push("/home");
    return <></>;
  }

  return (
    <div>
      <Login />
    </div>
  );
}
