import React, { PropsWithChildren } from "react";
import { Title } from "react-head";
import { Link } from "react-router-dom";

const links = [
  {
    href: "/garages",
    text: "Garages",
  },
];

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Title>MPP UBB</Title>
      <div className="bg-slate-700 p-4">
        <div className="container mx-auto px-3 text-white flex">
          <span className="font-bold mr-3">
            <Link to="/">UBB MPP</Link>
          </span>
          {links.map(link => (
            <Link key={link.href} to={link.href} className="px-3">
              {link.text}
            </Link>
          ))}
          <span className="mr-auto"></span>
          {/* <span className="px-3">Logout</span> */}
        </div>
      </div>
      <div className="container mx-auto px-3 py-6">{children}</div>
    </>
  );
}
