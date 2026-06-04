import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import Button from "./button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) => {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className=" px-4 py-3">
      <div className=" flex justify-center items-center gap-5">
        <div>
          <nav className="relative z-0 inline-flex -space-x-px">
            <Button
              hierarchy="tertiary"
              leftIcon={<CaretLeftIcon className="h-8 w-8" />}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative  disabled:text-grey-300 disabled:cursor-not-allowed cursor-pointer text-grey-600 font-semibold text-sm capitalize"
            >
              previous
            </Button>
            {getPageNumbers().map((page, idx) => (
              <button
                key={idx}
                onClick={() => typeof page === "number" && onPageChange(page)}
                disabled={page === "..."}
                className={`relative inline-flex items-center px-4 py-2 text-base font-semibold cursor-pointer ${
                  page === currentPage
                    ? "z-10  text-brand-600"
                    : page === "..."
                      ? "  text-gray-400 cursor-default"
                      : " text-gray-700 hover:bg-brand-50"
                }`}
              >
                {page}
              </button>
            ))}

            <Button
              hierarchy="tertiary"
              rightIcon={<CaretRightIcon className="h-8 w-8" />}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={
                currentPage === totalPages ||
                totalPages === 0 ||
                totalItems <= itemsPerPage
              }
              className="relative  disabled:text-grey-300 disabled:cursor-not-allowed cursor-pointer text-grey-600 font-semibold text-sm capitalize"
            >
              next
            </Button>
          </nav>
        </div>
        <div>
          <p className="text-sm text-grey-600 font-semibold">
            Showing <span>{startItem}</span> to <span>{endItem}</span> of{" "}
            <span>{totalItems}</span> results
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
