import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import Link from "next/link";
import { redirect } from "next/navigation";

const NotFound = async () => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  return (
    <div className="p-1 lg:p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px] mb-2">
      <div className="grid grid-cols-1 gap-4">
        <h1 className="text-6xl font-semibold text-left text-primary">
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
