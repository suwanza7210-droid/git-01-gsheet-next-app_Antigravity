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
    disabled = false,
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
        <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
                หน้า {currentPage} จาก {totalPages}
            </div>

            <div className="flex items-center space-x-1">
                {/* ปุ่มย้อนกลับ */}
                <button
                    onClick={() => !disabled && onPageChange(Math.max(1, currentPage - 1))}
                    disabled={disabled || currentPage === 1}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 1 || disabled
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                {/* รายการเลขหน้า */}
                {getPageNumbers().map(page => (
                    <button
                        key={page}
                        onClick={() => !disabled && onPageChange(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {page}
                    </button>
                ))}

                {/* ปุ่มถัดไป */}
                <button
                    onClick={() => !disabled && onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={disabled || currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages || disabled
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
