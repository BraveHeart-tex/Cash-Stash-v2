"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const RoutePaginationControls = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
}: PaginationControlsProps) => {
  const t = useTranslations("Components.RoutePaginationControls");
  const [changingPage, setChangingPage] = useState(false);
  const [, setPage] = useQueryState("page", {
    defaultValue: "1",
    shallow: false,
  });

  const handlePageChange = (type: "increment" | "decrement") => {
    if (changingPage) return;
    setChangingPage(true);
    setPage((prevPage) => {
      const nextPage =
        type === "increment"
          ? Number.parseInt(prevPage) + 1
          : Number.parseInt(prevPage) - 1;
      return nextPage.toString();
    });
    setChangingPage(false);
  };

  return (
    <div className="flex w-full items-center justify-center space-x-4">
      <Button
        onClick={() => handlePageChange("decrement")}
        disabled={!hasPreviousPage || changingPage || currentPage === 1}
        className="flex select-none items-center gap-1"
        variant="outline"
      >
        <FaChevronLeft />
        {t("previous")}
      </Button>
      <span className="text-sm font-medium text-foreground">
        {t("pageInformation", { currentPage, totalPages })}
      </span>
      <Button
        onClick={() => handlePageChange("increment")}
        disabled={!hasNextPage || changingPage || totalPages === currentPage}
        className="flex select-none items-center gap-1"
        variant="outline"
      >
        {t("next")}
        <FaChevronRight />
      </Button>
    </div>
  );
};

export default RoutePaginationControls;
