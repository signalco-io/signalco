import React, { useEffect } from "react";
import { useAuth } from "react-use-auth";
import HttpService from "../src/services/HttpService";
import { useRouter } from "next/router";

const AUTHCallback = () => {
  const { handleAuthentication, authResult } = useAuth();
  const router = useRouter();
  useEffect(() => {
    var parsedHash = new URLSearchParams(
      window.location.hash.substr(1) // skip the first char (#)
    );

    const token = parsedHash.get("access_token");
    if (token != null && typeof localStorage !== "undefined") {
      localStorage.setItem("auth:token", JSON.stringify(token));
      HttpService.token = token;
    }

    handleAuthentication({ postLoginRoute: "/home" });
  }, []);

  useEffect(() => {
    console.log("ID Token", router.query.id_token);
  }, [router.query]);

  return (
    <div>
      This is the auth callback page, you should be redirected immediately.
    </div>
  );
};

export default AUTHCallback;
