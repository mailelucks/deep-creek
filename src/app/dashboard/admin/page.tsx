import React from "react";
import { checkUserRole } from "@/lib/auth-server";

export const metadata = {
  title: "Admin Dashboard | My App",
  description: "Admin dashboard controls",
};

export default async function AdminDashboardPage() {
  // This will redirect if the user is not an admin
  const user = await checkUserRole("admin");

  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            Admin Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-5">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Admin Controls
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                This section is only visible to admins.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5">
              <p className="text-sm text-gray-700">
                Here you can manage users, roles, and system settings.
              </p>

              <div className="mt-4 space-y-4">
                <div className="rounded-md bg-gray-50 p-4">
                  <h3 className="text-md font-medium text-gray-900">
                    User Management
                  </h3>
                  <p className="text-sm text-gray-600">
                    Add, edit, or remove users. Assign roles and permissions.
                  </p>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <h3 className="text-md font-medium text-gray-900">
                    System Settings
                  </h3>
                  <p className="text-sm text-gray-600">
                    Configure application behavior and defaults.
                  </p>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <h3 className="text-md font-medium text-gray-900">
                    Analytics
                  </h3>
                  <p className="text-sm text-gray-600">
                    View system usage statistics and reports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
