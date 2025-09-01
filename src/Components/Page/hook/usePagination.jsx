import { useState } from "react";

const usePagination = (data, itemsPerPage) => {
    const [currentPage, setCurrentPage] = useState(1);

    const maxPage = Math.ceil(data.length / itemsPerPage);

    function currentData() {
        const begin = (currentPage - 1) * itemsPerPage;
        const end = begin + itemsPerPage;
        return data.slice(begin, end);
    }

    function next() {
        setCurrentPage((current) => Math.min(current + 1, maxPage));
    }

    function prev() {
        setCurrentPage((current) => Math.max(current - 1, 1));
    }

    function jump(page) {
        const pageNumber = Math.max(1, page);
        setCurrentPage(() => Math.min(pageNumber, maxPage));
    }

    return { currentData, currentPage, maxPage, next, prev, jump };
};

export default usePagination;
