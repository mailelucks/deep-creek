// components/dashboard-ui.tsx
"use client";
import React from "react";
import { ServerSideUser } from "@/lib/auth-server";
import { logoutAction } from "@/lib/actions";

interface DashboardNavbarProps {
  user: ServerSideUser;
}

export default function DashboardNavbar({ user }: DashboardNavbarProps) {
  return (
    <nav className="bg-white shadow-sm">
      {/* Dashboard UI content */}
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main>{/* User info display */}</main>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <form action={logoutAction}>
            <button
              type="submit"
              className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
