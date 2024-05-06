import Dashboard from "@/components/main-dashboard";
import { getUser } from "@/lib/auth/session";
import { redirect } from "@/navigation";
import { PAGE_ROUTES } from "@/lib/constants";

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
