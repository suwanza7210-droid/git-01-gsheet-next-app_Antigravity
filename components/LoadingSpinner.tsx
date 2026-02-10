import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-sm text-gray-500 font-medium">กำลังโหลดข้อมูล...</p>
        </div>
    );
};

export default LoadingSpinner;
