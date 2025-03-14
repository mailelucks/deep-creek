import React from "react";
import { checkUserRole } from "@/lib/auth-server";

export const metadata = {
  title: "Editor Dashboard | My App",
  description: "Editor dashboard controls",
};

export default async function EditorDashboardPage() {
  // This will redirect if the user is not an editor or admin
  const user = await checkUserRole("editor");

  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            Editor Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-5">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Editor Controls
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                This section is only visible to editors and admins.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5">
              <p className="text-sm text-gray-700">
                Here you can manage content and publications.
              </p>

              <div className="mt-4 space-y-4">
                <div className="rounded-md bg-gray-50 p-4">
                  <h3 className="text-md font-medium text-gray-900">
                    Content Management
                  </h3>
                  <p className="text-sm text-gray-600">
                    Create, edit, and publish content.
                  </p>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <h3 className="text-md font-medium text-gray-900">
                    Media Library
                  </h3>
                  <p className="text-sm text-gray-600">
                    Upload and manage images, videos, and documents.
                  </p>
                </div>
                <div className="rounded-md bg-gray-50 p-4">
                  <h3 className="text-md font-medium text-gray-900">
                    Editorial Calendar
                  </h3>
                  <p className="text-sm text-gray-600">
                    Schedule content publication and review deadlines.
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
