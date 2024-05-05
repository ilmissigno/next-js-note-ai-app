import React from "react";
import Navbar from "./Navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar></Navbar>
      <main className="p-4 max-w-7xl m-auto">{children}</main>
    </>
  );
}
