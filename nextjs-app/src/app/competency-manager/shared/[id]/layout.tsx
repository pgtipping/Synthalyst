import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Shared Framework | Synthalyst",
  description: "View a shared competency framework",
};

export default function SharedFrameworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
