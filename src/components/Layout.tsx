import React, { PropsWithChildren } from "react";
import { Title } from "react-head";
import { Link } from "react-router-dom";

const links = [
  {
    href: "#",
    text: "Go here",
  },
  {
    href: "#",
    text: "Go there",
  },
  {
    href: "#",
    text: "Go nowhere",
  },
];

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Title>Mama are mere</Title>
      <div className="bg-slate-700 p-4">
        <div className="container mx-auto px-3 text-white flex">
          <span className="font-bold mr-3">Bucket List Manager</span>
          {links.map(link => (
            <Link to={link.href} className="px-3">
              {link.text}
            </Link>
          ))}
          <span className="mr-auto"></span>
          <span className="px-3">Logout</span>
        </div>
      </div>
      <div className="container mx-auto px-3 py-6">{children}</div>
    </>
  );
}
