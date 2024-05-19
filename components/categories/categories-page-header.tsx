import CreateCategoryButton from "@/components/create-buttons/create-category-button";
import { useTranslations } from "next-intl";

const CategoriesPageHeader = () => {
  const t = useTranslations("Categories");
  return (
    <header className="flex w-full flex-col gap-1">
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
          {t("pageTitle")}
        </h1>
        <CreateCategoryButton />
      </div>
      <p className="text-muted-foreground">{t("pageDescription")}</p>
    </header>
  );
};

export default CategoriesPageHeader;
