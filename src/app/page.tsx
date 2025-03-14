import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";

export default async function Home() {
  const user = await getServerSession();

  // Redirect based on authentication status
  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/auth/login");
  }

  // This will never be shown, but is required for the component
  return null;
}
