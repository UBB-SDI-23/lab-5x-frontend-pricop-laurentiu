import React, { PropsWithChildren, useState } from "react";
import { Title } from "react-head";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useUser } from "../lib/user-context";
import { useMediaQuery } from "react-responsive";
import classNames from "classnames";

const links = [
  {
    href: "/garages",
    text: "Garages",
  },
  {
    href: "/buses",
    text: "Buses",
  },
  {
    href: "/lines",
    text: "Lines",
  },
  {
    href: "/stations",
    text: "Stations",
  },
  {
    href: "/chat",
    text: "Chat",
  },
  {
    href: "/admin",
    text: "Admin",
    ifRoles: ["admin"],
  },
];

export default function Layout({ children, isLoading = false }: { isLoading?: boolean } & PropsWithChildren) {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const user = useUser();
  return (
    <>
      <Title>MPP UBB</Title>
      <div className="bg-slate-700 p-4 flex">
        <div
          className={classNames({
            "container mx-auto px-3 text-white flex": true,
            "flex-col gap-2": isMobile && !isNavbarCollapsed,
          })}
        >
          <span className="font-bold mr-3">
            <Link to="/">UBB MPP</Link>
          </span>
          {(!isMobile || (isMobile && !isNavbarCollapsed)) && (
            <>
              {links
                .filter(l => (l.ifRoles ? l.ifRoles.includes(user.user?.role ?? "") : true))
                .map(link => (
                  <Link key={link.href} to={link.href} className="px-3">
                    {link.text}
                  </Link>
                ))}
              <span className="mr-auto"></span>
              {user.user ? (
                <>
                  <div className="mr-2 text-right">
                    Logged in as <Link to="/profile">{user.user!.username}</Link>
                  </div>
                  <button className={classNames({ "text-right": isMobile })} onClick={user.logout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth/login">Login</Link>
                </>
              )}
              {/* <span className="px-3">Logout</span> */}
            </>
          )}
          {isMobile && (
            <>
              {isNavbarCollapsed && <button onClick={() => setIsNavbarCollapsed(false)}>Show</button>}
              {!isNavbarCollapsed && <button onClick={() => setIsNavbarCollapsed(true)}>Hide</button>}
            </>
          )}
        </div>
      </div>
      <div className="container mx-auto px-3 py-6 relative">
        {user.isLoading || isLoading ? <LoadingSpinner className="flex justify-center" /> : children}
      </div>
    </>
  );
}
