"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type AdminRole = "full_access" | "orders_only";

export default function AdminAccessLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<AdminRole>("full_access");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadRole() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        router.replace("/admin");
        return;
      }

      const { data } = await supabase
        .from("admin_permissions")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!active) return;
      const resolvedRole = data?.role === "orders_only" ? "orders_only" : "full_access";
      setRole(resolvedRole);
      setLoading(false);
    }

    loadRole();
    return () => { active = false; };
  }, [router]);

  if (loading) return <div className="min-h-screen bg-liora-50" />;

  return (
    <div className={role === "orders_only" ? "orders-only-access" : "full-admin-access"}>
      <div className="border-b border-liora-100 bg-white px-3 pt-3" dir="rtl">
        <div className="mx-auto flex max-w-[1900px] gap-2">
          <Link
            href="/admin/orders"
            className={`px-4 py-2 text-sm font-bold ${pathname === "/admin/orders" ? "border-b-2 border-liora-800 text-liora-900" : "text-liora-500"}`}
          >
            الطلبات
          </Link>
          {role === "full_access" && (
            <Link
              href="/admin/permissions"
              className={`px-4 py-2 text-sm font-bold ${pathname === "/admin/permissions" ? "border-b-2 border-liora-800 text-liora-900" : "text-liora-500"}`}
            >
              الصلاحيات
            </Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
