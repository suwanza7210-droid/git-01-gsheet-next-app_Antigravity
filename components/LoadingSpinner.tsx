import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-3 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
    );
};

export default LoadingSpinner;
