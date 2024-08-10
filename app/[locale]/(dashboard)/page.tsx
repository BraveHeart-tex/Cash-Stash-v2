import Dashboard from "@/components/main-dashboard";
import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import { redirect } from "@/navigation";

export default async function Home() {
  const user = await getUser();
  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  return (
    <main>
      <Dashboard />
    </main>
  );
}
