import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import { redirect } from "@/navigation";
import Link from "next/link";

const NotFound = async () => {
  const { user } = await getUser();
  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  return (
    <div className="mx-auto mb-2 p-1 lg:max-w-[1300px] lg:p-4 xl:max-w-[1600px]">
      <div className="grid grid-cols-1 gap-4">
        <h1 className="text-left text-6xl font-semibold text-primary">
          404 Page Not Found...
        </h1>
        <p className="text-foreground">
          Looks like you tried to navigate to a page that doesn&apos;t exist.
        </p>
        <Button className="w-max">
          <Link href={PAGE_ROUTES.HOME_PAGE}>Back to the home page</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
