import Dashboard from "@/components/main-dashboard";
import { getUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { PAGE_ROUTES } from "@/lib/constants";

export default async function Home() {
  const user = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  return (
    <main>
      <Dashboard />
    </main>
  );
}
