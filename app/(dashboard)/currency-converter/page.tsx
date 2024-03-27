import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import { redirect } from "next/navigation";

const CurrencyConverterPage = async () => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  return (
    <main className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <div className="flex flex-col gap-1">
        <h2 className="text-4xl text-primary">Currency Converter</h2>
        <p className="text-muted-foreground">
          See the current exchange rates and convert between your preferred
          currencies.
        </p>
      </div>
    </main>
  );
};

export default CurrencyConverterPage;
