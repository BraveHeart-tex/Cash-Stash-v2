"use client";
import { useQueryState } from "nuqs";
import { Button } from "./ui/button";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface IPaginationControlsProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const RoutePaginationControls = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
}: IPaginationControlsProps) => {
  const [changingPage, setChangingPage] = useState(false);
  const [page, setPage] = useQueryState("page", {
    defaultValue: "1",
    shallow: false,
  });

  const handlePageChange = (type: "increment" | "decrement") => {
    if (changingPage) return;
    setChangingPage(true);
    setPage((prevPage) => {
      const nextPage =
        type === "increment" ? parseInt(prevPage) + 1 : parseInt(prevPage) - 1;
      return nextPage.toString();
    });
    setChangingPage(false);
  };

  return (
    <div className="w-full flex items-center justify-center space-x-4">
      <Button
        onClick={() => handlePageChange("decrement")}
        disabled={!hasPreviousPage || changingPage || currentPage === 1}
        className="select-none flex items-center gap-1"
        variant="outline"
      >
        <FaChevronLeft />
        Previous
      </Button>
      <span className="font-medium text-foreground text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => handlePageChange("increment")}
        disabled={!hasNextPage || changingPage || totalPages === currentPage}
        className="select-none flex items-center gap-1"
        variant="outline"
      >
        Next
        <FaChevronRight />
      </Button>
    </div>
  );
};

export default RoutePaginationControls;
