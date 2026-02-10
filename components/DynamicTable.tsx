'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import toast, { Toaster } from 'react-hot-toast';

interface DynamicTableProps {
    tabName: string; // The sheet name (e.g. 'Customers')
    title: string;   // Display title
    columns: { key: string; label: string; minWidth?: string }[]; // Column definition
    onAdd?: () => void; // Optional override handling
}

export default function DynamicTable({ tabName, title, columns }: DynamicTableProps) {
    // State management
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const flattenedColumns = ['id', ...columns.map(c => c.key), 'createdAt', 'image']; // Internal structure mapping expectation

    // Pagination
    const itemsPerPage = 8;

    // Fetch Data
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/google-sheets?tab=${tabName}`);
            if (!res.ok) throw new Error('Failed to fetch data');
            const result = await res.json();

            // Transform array of arrays to objects based on assumption of column order
            // Assuming order: ID, Name, Col3, Col4, CreatedAt, Image
            // This is a bit rigid, but we need some structure.
            // Let's assume the API returns the raw rows.
            const formatted = result.map((row: string[]) => {
                // Dynamic mapping could be complex. For now, map to standard "Fields"
                return {
                    id: row[0],
                    col1: row[1], // Name
                    col2: row[2], // Position/Phone
                    col3: row[3], // Dept/Email
                    createdAt: row[4],
                    image: row[5]
                };
            });
            setData(formatted);
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [tabName]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Filtering
    const filteredData = useMemo(() => {
        return data.filter(item => {
            const term = searchTerm.toLowerCase();
            return (
                item.id?.toLowerCase().includes(term) ||
                item.col1?.toLowerCase().includes(term) ||
                item.col2?.toLowerCase().includes(term) ||
                item.col3?.toLowerCase().includes(term)
            );
        });
    }, [data, searchTerm]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Delete
    const handleDelete = async (id: string) => {
        if (!confirm('ยืนยันการลบข้อมูล?')) return;

        // Find index in original data (not sorted/filtered)
        // Since API delete needs actual rowIndex in Sheet, we need to match it.
        // If data might change order, we need to rely on ID search in API or keep track of index.
        // API DELETE now accepts rowIndex. We need to find the index in the FULL list.
        const index = data.findIndex(d => d.id === id);
        if (index === -1) return;

        try {
            const res = await fetch(`/api/google-sheets?tab=${tabName}`, {
                method: 'DELETE',
                body: JSON.stringify({ rowIndex: index }),
            });
            if (res.ok) {
                toast.success('ลบข้อมูลสำเร็จ');
                fetchData(); // Reload
            } else {
                toast.error('ลบข้อมูลไม่สำเร็จ');
            }
        } catch (err) {
            toast.error('เกิดข้อผิดพลาด');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <Toaster />

            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                    <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder={`ค้นหา ${title}...`} />
                    <button className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        เพิ่มข้อมูล
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-16"><LoadingSpinner /></div>
            ) : error ? (
                <div className="text-red-500 text-center py-12 bg-red-50">{error}</div>
            ) : (
                <>
                    {/* Table Content */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    {columns.map((col, idx) => (
                                        <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.label}</th>
                                    ))}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length + 2} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-gray-300 mb-3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                                </svg>
                                                <span>ไม่พบข้อมูล</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">{item.id}</td>
                                            {/* Generic Column Mapping Logic */}
                                            <td className="px-6 py-4 text-sm text-gray-600">{item.col1}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{item.col2}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{item.col3}</td>

                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button className="p-2 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
