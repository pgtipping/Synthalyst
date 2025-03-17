"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  // Don't render the header on admin pages
  if (isAdminPage) {
    return null;
  }

  return <Header />;
}
