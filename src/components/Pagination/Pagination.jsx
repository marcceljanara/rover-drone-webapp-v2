import React from "react";
import "./Pagination.css";

const clampPage = (page, totalPages) => Math.min(Math.max(page, 1), totalPages);

const getVisiblePages = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push("start-ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) {
    pages.push("end-ellipsis");
  }

  pages.push(totalPages);
  return pages;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems = 0,
  pageSize,
  itemLabel = "data",
  className = "",
}) => {
  const safeTotalPages = Math.max(1, totalPages || 1);
  const safeCurrentPage = clampPage(currentPage || 1, safeTotalPages);
  const hasItems = totalItems > 0;
  const startItem = hasItems && pageSize ? (safeCurrentPage - 1) * pageSize + 1 : 0;
  const endItem = hasItems && pageSize ? Math.min(safeCurrentPage * pageSize, totalItems) : 0;
  const visiblePages = getVisiblePages(safeCurrentPage, safeTotalPages);

  const goToPage = (page) => {
    onPageChange(clampPage(page, safeTotalPages));
  };

  return (
    <nav className={`app-pagination ${className}`.trim()} aria-label={`Navigasi halaman ${itemLabel}`}>
      <p className="app-pagination__summary">
        {hasItems && pageSize
          ? `Menampilkan ${startItem}-${endItem} dari ${totalItems} ${itemLabel}`
          : `Tidak ada ${itemLabel}`}
      </p>

      <div className="app-pagination__controls">
        <button
          type="button"
          className="app-pagination__button app-pagination__button--compact"
          onClick={() => goToPage(1)}
          disabled={safeCurrentPage <= 1}
          aria-label="Halaman pertama"
        >
          Awal
        </button>

        <button
          type="button"
          className="app-pagination__button"
          onClick={() => goToPage(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1}
          aria-label="Halaman sebelumnya"
        >
          Sebelumnya
        </button>

        <div className="app-pagination__pages" aria-label={`Halaman ${safeCurrentPage} dari ${safeTotalPages}`}>
          {visiblePages.map((page) =>
            typeof page === "number" ? (
              <button
                key={page}
                type="button"
                className="app-pagination__page"
                onClick={() => goToPage(page)}
                aria-label={`Buka halaman ${page}`}
                aria-current={page === safeCurrentPage ? "page" : undefined}
                disabled={page === safeCurrentPage}
              >
                {page}
              </button>
            ) : (
              <span key={page} className="app-pagination__ellipsis" aria-hidden="true">
                ...
              </span>
            )
          )}
        </div>

        <button
          type="button"
          className="app-pagination__button"
          onClick={() => goToPage(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= safeTotalPages}
          aria-label="Halaman berikutnya"
        >
          Berikutnya
        </button>

        <button
          type="button"
          className="app-pagination__button app-pagination__button--compact"
          onClick={() => goToPage(safeTotalPages)}
          disabled={safeCurrentPage >= safeTotalPages}
          aria-label="Halaman terakhir"
        >
          Akhir
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
