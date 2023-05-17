import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../lib/user-context";
import Layout from "./Layout";
import { PropsWithChildren, useEffect } from "react";
import { UserRole } from "../lib/types";

export default function AuthRedirect({
  notLoggedIn,
  loggedIn,
  allowedRoles,
  children,
}: { notLoggedIn?: string; loggedIn?: string; allowedRoles?: UserRole[] } & PropsWithChildren) {
  const user = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user.isLoading) return;
    if (notLoggedIn && !user.user) return navigate(notLoggedIn);
    if (loggedIn && user.user) return navigate(loggedIn);
  }, [user, location]);

  if (user.isLoading) return <Layout isLoading={true}></Layout>;
  if (user.user && allowedRoles && !allowedRoles.includes(user.user!.role))
    return <Layout>You are not allowed to visit this page.</Layout>;
  if (!notLoggedIn && !user.user) return <>{children}</>;
  if (!loggedIn && user.user) return <>{children}</>;
  return <>You are being redirected.</>;
}
