"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES } from "@/lib/constants";
import { cn } from "@/lib/utils/stringUtils/cn";
import { usePathname, useRouter } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { FaCheck } from "react-icons/fa";

const LocaleToggle = () => {
  const t = useTranslations("Components.LocaleToggle");
  let [, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();

  const fullUrl =
    pathname + "?" + new URLSearchParams(params as any).toString();

  const handleLocaleSwitch = (locale: string) => {
    startTransition(() => {
      router.replace(fullUrl, {
        locale,
      });
    });
  };

  const iconMap: Record<string, string> = {
    tr: "🇹🇷",
    en: "🇺🇸",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button className="bg-background hover:bg-background/80" size="icon">
          <span className="text-xl">{iconMap[locale]}</span>
          <span className="sr-only">{t("screenReaderLabel")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((localeValue) => (
          <DropdownMenuItem
            key={localeValue}
            className={cn(
              "flex cursor-pointer items-center gap-1 text-base font-medium",
              locale === localeValue && "text-primary"
            )}
            aria-label={t("switchItemAriaLabel", { language: t(localeValue) })}
            onClick={() => handleLocaleSwitch(localeValue)}
          >
            {iconMap[localeValue]}
            <span>{t(localeValue)}</span>
            {locale === localeValue && <FaCheck className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleToggle;
