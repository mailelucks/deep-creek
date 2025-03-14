import React from "react";
import { getServerSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerSession();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar user={user} />
      {children}
    </div>
  );
}
