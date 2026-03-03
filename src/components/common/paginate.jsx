import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const Paginate = ({ totalPages, currentPage, onPageChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handlePageChange = (page) => {
    onPageChange(page);

    // Update query parameter in URL
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", page);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  // Calculate pages to display (max 3 at a time)
  const getVisiblePages = () => {
    if (totalPages <= 3)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (currentPage === 1) return [1, 2, 3];
    if (currentPage === totalPages)
      return [totalPages - 2, totalPages - 1, totalPages];

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="py-4 flex justify-center">
      <Pagination className="px-2 py-1">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className={`rounded-full px-3 py-1 text-white ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#F06B3C] hover:bg-orange-500"
              }`}
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
            />
          </PaginationItem>

          {/* Show ellipsis if currentPage is beyond 2 */}
          {currentPage > 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {visiblePages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                className="px-3 py-1"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Show ellipsis if currentPage is before totalPages - 1 */}
          {currentPage < totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              className={`rounded-full px-3 py-1 text-white ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#F06B3C] hover:bg-orange-500"
              }`}
              onClick={(e) => {
                e.preventDefault();

                if (currentPage < totalPages) {
                  handlePageChange(currentPage + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Paginate;
