"use client";

import { usePathname } from "next/navigation";
import NavBar from "./common/components/NavBar";

const excludedPaths = ["/login", "/register"];

export default function ConditionalNavBar() {
  const pathname = usePathname();

  if (excludedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return null;
  }

  return <NavBar />;
}
