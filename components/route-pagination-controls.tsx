"use client";
import { useQueryState } from "nuqs";
import { Button } from "./ui/button";

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
  const [page, setPage] = useQueryState("page", {
    defaultValue: "1",
    shallow: false,
  });

  const handlePageChange = (type: "increment" | "decrement") => {
    setPage((prevPage) => {
      const nextPage =
        type === "increment" ? parseInt(prevPage) + 1 : parseInt(prevPage) - 1;
      return nextPage.toString();
    });
  };

  return (
    <div className="w-full flex items-center justify-center space-x-4">
      <Button
        onClick={() => handlePageChange("decrement")}
        disabled={!hasPreviousPage}
      >
        Previous
      </Button>
      <div>
        Page {currentPage} of {totalPages}
      </div>
      <Button
        onClick={() => handlePageChange("increment")}
        disabled={!hasNextPage}
      >
        Next
      </Button>
    </div>
  );
};

export default RoutePaginationControls;
