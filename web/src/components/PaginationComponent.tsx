import { Pagination } from "react-bootstrap";
import { useRouter } from "next/router";

type PaginationComponentProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const PaginationComponent: React.FC<PaginationComponentProps> = ({ currentPage, totalPages, onPageChange }) => {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    onPageChange(page);
    router.push(`/?page=${page}`);
  };

  const maxDisplayedPages = 10;
  let startPage: number, endPage: number;

  if (totalPages <= maxDisplayedPages) {
    startPage = 1;
    endPage = totalPages;
  } else {
    const maxPagesBeforeCurrentPage = Math.floor(maxDisplayedPages / 2);
    const maxPagesAfterCurrentPage = Math.ceil(maxDisplayedPages / 2) - 1;

    if (currentPage <= maxPagesBeforeCurrentPage) {
      startPage = 1;
      endPage = maxDisplayedPages;
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      startPage = totalPages - maxDisplayedPages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - maxPagesBeforeCurrentPage;
      endPage = currentPage + maxPagesAfterCurrentPage;
    }
  }

  return (
    <Pagination>
      {currentPage > 1 && (
        <>
          <Pagination.First onClick={() => handlePageChange(1)} />
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
        </>
      )}

      {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
        <Pagination.Item
          key={startPage + index}
          active={currentPage === startPage + index}
          onClick={() => handlePageChange(startPage + index)}
        >
          {startPage + index}
        </Pagination.Item>
      ))}

      {currentPage < totalPages && (
        <>
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
          <Pagination.Last onClick={() => handlePageChange(totalPages)} />
        </>
      )}
    </Pagination>
  );
};

export default PaginationComponent;
