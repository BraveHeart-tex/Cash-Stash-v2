import { Button } from "@/components/ui/button";
import { PAGE_ROUTES } from "@/lib/constants";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

const NotFound = () => {
  const t = useTranslations("NotFound");
  return (
    <div className="mx-auto mb-2 flex h-screen flex-col items-center justify-center p-1 lg:max-w-[1300px] lg:p-4 xl:max-w-[1600px]">
      <div className="grid grid-cols-1 gap-4 p-2 text-center">
        <h1 className="text-left text-6xl font-semibold text-primary">
          {t("title")}
        </h1>
        <p className="text-muted-foreground">{t("description")}</p>
        <Button type="button" name="go-home">
          <Link href={PAGE_ROUTES.HOME_PAGE}>{t("linkLabel")}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
