'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import EmployeeForm from '@/components/EmployeeForm';
import { useSession } from 'next-auth/react'; // Import useSession

export default function AddEmployeePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingEmployeeIds, setExistingEmployeeIds] = useState<string[]>([]);

    const { status } = useSession();

    const fetchEmployeeIds = useCallback(async () => {
        try {
            const employeesRes = await fetch('/api/google-sheets');
            if (employeesRes.ok) {
                const employeesData = await employeesRes.json();
                const ids = employeesData.map((row: string[]) => row[0]);
                setExistingEmployeeIds(ids);
            } else {
                console.error('Failed to fetch existing employees.');
            }
        } catch (error) {
            console.error('Error fetching employee IDs:', error);
        }
    }, []);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchEmployeeIds();
        }
        setIsLoading(status === 'loading');
    }, [status, fetchEmployeeIds]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">กำลังตรวจสอบสิทธิ์การเข้าถึง...</p>
                </div>
            </div>
        );
    }

    if (status !== 'authenticated') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md w-96 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-red-600">การเข้าถึงถูกปฏิเสธ</h2>
                    <p className="mb-6">คุณไม่มีสิทธิ์เข้าถึงหน้านี้ โปรดล็อกอินก่อน</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        ไปหน้าล็อกอิน
                    </button>
                </div>
            </div>
        );
    }

    const handleAddEmployee = async (formData: { id: string; name: string; position: string; department: string; image: string; }) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/google-sheets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                if (response.status === 409) {
                    // หากเป็น error รหัสซ้ำ ให้ fetch ข้อมูล ID ใหม่
                    fetchEmployeeIds();
                }
                const errorData = await response.json();
                throw new Error(errorData.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }

            // หากสำเร็จ อัปเดตรายการ ID ใน state
            setExistingEmployeeIds(prevIds => [...prevIds, formData.id]);

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">บันทึกข้อมูลพนักงานใหม่</h1>
                    <div className="space-x-3">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            กลับหน้าหลัก
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            ดูรายชื่อพนักงาน
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <EmployeeForm
                        initialData={{ id: '', name: '', position: '', department: '', image: '' }}
                        onSubmit={handleAddEmployee}
                        isSubmitting={isSubmitting}
                        isEdit={false}
                        existingIds={existingEmployeeIds}
                    />
                </div>

                <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">คู่มือการบันทึกข้อมูล</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>กรุณากรอกข้อมูลให้ครบทุกช่อง</li>
                        <li>รหัสพนักงานต้องไม่ซ้ำกับข้อมูลที่มีอยู่</li>
                        <li>ตรวจสอบความถูกต้องของข้อมูลก่อนกดบันทึก</li>
                        <li>ข้อมูลจะถูกบันทึกลงใน Google Sheet ทันที</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}