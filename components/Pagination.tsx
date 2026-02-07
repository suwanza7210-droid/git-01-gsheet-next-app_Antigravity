import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    disabled = false,         // ← default false
}) => {
    // สร้างรายการเลขหน้า
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = startPage + maxVisiblePages - 1;

            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center space-x-1">
            {/* ปุ่มย้อนกลับ */}
            <button
                // onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                onClick={() => !disabled && onPageChange(Math.max(1, currentPage - 1))}
                // disabled={currentPage === 1}
                disabled={disabled || currentPage === 1}
                // className={`px-3 py-1 rounded 
                className={`px-3 py-1 rounded ${currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                &lt;
            </button>

            {/* รายการเลขหน้า */}
            {getPageNumbers().map(page => (
                <button
                    key={page}
                    // onClick={() => onPageChange(page)}
                    onClick={() => !disabled && onPageChange(page)}
                    className={`px-3 py-1 rounded ${currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } ${disabled
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                >
                    {page}
                </button>
            ))}

            {/* ปุ่มถัดไป */}
            <button
                // onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                onClick={() => !disabled && onPageChange(Math.min(totalPages, currentPage + 1))}
                // disabled={currentPage === totalPages}
                disabled={disabled || currentPage === totalPages}
                // className={`px-3 py-1 rounded ${
                className={`px-3 py-1 rounded ${currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                &gt;
            </button>

            {/* ข้อมูลหน้า */}
            <div className="ml-4 text-sm text-gray-600">
                หน้า {currentPage} จาก {totalPages}
            </div>
        </div>
    );
};

export default Pagination;
