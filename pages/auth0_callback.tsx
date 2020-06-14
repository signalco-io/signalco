import React, { useEffect } from "react";
import { useAuth } from "react-use-auth";

const AUTHCallback = () => {
  const { handleAuthentication } = useAuth();
  useEffect(() => {
    handleAuthentication({});
  }, []);

  return (
    <div>
      This is the auth callback page, you should be redirected immediately.
    </div>
  );
};

export default AUTHCallback;
