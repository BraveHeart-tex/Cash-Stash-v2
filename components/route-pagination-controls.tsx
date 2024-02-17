"use client";
import { useQueryState } from "nuqs";
import { Button } from "./ui/button";
import { useState } from "react";

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
      const nextPage = type === "increment" ? parseInt(prevPage) + 1 : parseInt(prevPage) - 1;
      return nextPage.toString();
    });
    setChangingPage(false);
  };

  return (
    <div className="w-full flex items-center justify-center space-x-4">
      <Button
        onClick={() => handlePageChange("decrement")}
        disabled={!hasPreviousPage || changingPage || currentPage === 1}
        className="select-none"
      >
        Previous
      </Button>
      <div>
        Page {currentPage} of {totalPages}
      </div>
      <Button
        onClick={() => handlePageChange("increment")}
        disabled={!hasNextPage || changingPage || totalPages === currentPage}
        className="select-none"
      >
        Next
      </Button>
    </div>
  );
};

export default RoutePaginationControls;
