import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { axios, handleError, updateAxiosWithToken } from "../../../lib/axios";
import useRouteQuery from "../../../lib/hooks/useRouteQuery";
import CookieManager from "../../../lib/cookie-manager";
import { useUser } from "../../../lib/user-context";

export default function AuthConfirmPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [query] = useRouteQuery();
  const user = useUser();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/auth/activate/${query.code}`).then(d => d.data);
        const token = res.token;
        CookieManager.set("token", token);
        updateAxiosWithToken(token);
        user.invalidate();
      } catch (err: any) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [query.code]);

  return <Layout isLoading={isLoading}>You have successfully confirmed your account!</Layout>;
}
