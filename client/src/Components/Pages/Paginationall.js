import React, { useEffect } from "react";
import { useState } from "react";
import { Pagination } from "react-bootstrap";

const Paginationall = ({ currentPage, totalPages, setcurrenPage }) => {
  const handleFirst = () => setcurrenPage(1);
  const handleLast = () => setcurrenPage(totalPages);
  const [pageNumbers, setPageNumbers] = useState([]);

  useEffect(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    setPageNumbers(pages);
  }, [totalPages]);

  const renderPaginationItems = () => {
    if (totalPages <= 1) {
      return (
        <Pagination.Item key={1} active= {1 === currentPage || totalPages === 0 }>
          1
        </Pagination.Item>
      );
    }

    return pageNumbers.map((number) => {
      //number 1
      if (
        number === 1 ||
        number === totalPages ||
        (number >= currentPage - 1 && number <= currentPage + 1) ||
        (number <= 4 && currentPage <= 4) ||
        (number >= totalPages - 3 && currentPage >= totalPages - 3)
      ) {
        
        return (
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => onPageChange(number)}
          >
            {number}
          </Pagination.Item>
        );
      } else if (
        number === currentPage - 2 ||
        number === currentPage + 2 ||
        (number === 5 && currentPage <= 4) ||
        (number === totalPages - 4 && currentPage >= totalPages - 3)
      )
      
      {
        return <Pagination.Ellipsis key={number} disabled />;
      } else {
        return null;
      }
    });
  };

  const onPageChange = (page) => {
    setcurrenPage(page)
  }

  return (
    <Pagination style={{margin:"0px"}}>
      <Pagination.First onClick={handleFirst} disabled={currentPage === 1 || totalPages <= 1} />
      <Pagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || totalPages <= 1}
      />
      {renderPaginationItems()}
      <Pagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages <= 1}
      />
      <Pagination.Last
        onClick={handleLast}
        disabled={currentPage === totalPages || totalPages <= 1}
      />
    </Pagination>
  );
};

export default Paginationall;
