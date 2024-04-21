import { convertCurrency } from "@/server/currencyRate";
import ConvertedCurrencyList from "@/components/currency-converter/converted-currency-list";
import CurrencyConverterInput from "@/components/currency-converter/currency-converter-input";
import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import { redirect } from "next/navigation";

const CurrencyConverterPage = async ({
  searchParams,
}: {
  searchParams: {
    currency: string;
    amount: string;
    to: string;
  };
}) => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  const { currency = "USD", amount, to = "EUR" } = searchParams;

  const { currencies, updatedAt } = await convertCurrency({
    currency,
    amount,
  });

  const convertedToCurrencyAmount =
    currencies.find((item) => item.symbol === to)?.amount || 0;

  return (
    <main className="mx-auto p-4 lg:max-w-[1300px] xl:max-w-[1600px]">
      <div className="flex flex-col gap-1">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
          Currency Converter
        </h1>
        <p className="text-muted-foreground">
          See the current exchange rates and convert between your preferred
          currencies.
        </p>
      </div>
      <div className="mt-4">
        <CurrencyConverterInput
          updatedAt={updatedAt}
          convertedToCurrencyAmount={convertedToCurrencyAmount}
        />
      </div>
      <ConvertedCurrencyList currencyList={currencies} />
    </main>
  );
};

export default CurrencyConverterPage;
