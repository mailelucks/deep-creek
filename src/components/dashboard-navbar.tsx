"use client";
import React from "react";
import Link from "next/link";
import { ServerSideUser } from "@/lib/auth-server";
import { logoutAction } from "@/lib/actions";

interface DashboardNavbarProps {
  user: ServerSideUser;
}

export default function DashboardNavbar({ user }: DashboardNavbarProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">My App</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              {user?.role === "admin" && (
                <Link
                  href="/dashboard/admin"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Admin Panel
                </Link>
              )}
              {(user?.role === "admin" || user?.role === "editor") && (
                <Link
                  href="/dashboard/editor"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Editor Panel
                </Link>
              )}
            </div>
          </div>
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
        </div>
      </div>
    </nav>
  );
}
