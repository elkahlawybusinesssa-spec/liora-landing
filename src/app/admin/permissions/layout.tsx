import AdminAccessLayout from "@/components/AdminAccessLayout";

export default function PermissionsLayout({ children }: { children: React.ReactNode }) {
  return <AdminAccessLayout>{children}</AdminAccessLayout>;
}
