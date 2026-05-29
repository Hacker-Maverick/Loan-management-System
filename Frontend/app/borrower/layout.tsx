import { AppShell } from "@/components/AppShell";

export default function BorrowerLayout({ children }: { children: React.ReactNode }) {
  return <AppShell section="borrower">{children}</AppShell>;
}
