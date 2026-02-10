//หน้านี้ใช้สำหรับแก้ไขข้อมูลพนักงานที่มีอยู่แล้ว
// โดยจะดึงข้อมูลพนักงานจาก Google Sheets API และแสดงฟอร์มให้แก้ไข
// เมื่อบันทึกจะส่งข้อมูลที่แก้ไขกลับไปยัง API เพื่ออัปเดตข้อมูล
'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EmployeeForm from '@/components/EmployeeForm';
import LoadingSpinner from '@/components/LoadingSpinner';
type Employee = {
    id: string;
    name: string;
    position: string;
    department: string;
    createdAt: string;
    image: string;
};

// กำหนดประเภทสำหรับข้อมูลแบบฟอร์ม
type EmployeeFormData = Omit<Employee, 'createdAt'>;

export default function EditEmployeePage() {
    const router = useRouter();
    const params = useParams();
    const employeeId = params.employeeId as string;

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    // const { data: session, status } = useSession();
    const { status } = useSession();
    //------------------------------------------------------------
    //- อธิบาย: สร้างสถานะสำหรับการบันทึกข้อมูล
    //- ใช้เพื่อแสดงสถานะการบันทึกข้อมูลพนักงาน
    // เป็นการเปลี่ยนค่า state isSaving ให้เป็น true ด้วยฟังก์ชัน setIsSaving (ซึ่งได้มาจาก useState)
    // ใช้เพื่อบอกให้ React รู้ว่าตอนนี้ระบบกำลังอยู่ในขั้นตอน "กำลังบันทึกข้อมูล" (เช่น กำลังส่งข้อมูลไป API)
    // มักใช้สำหรับแสดง loading spinner, ปิดปุ่ม submit หรือป้องกันการกดซ้ำระหว่างรอบันทึกข้อมูล
    //- สรุป:
    const [isSaving, setIsSaving] = useState(false);

    // ตรวจสอบสถานะการล็อกอินด้วย useSession
    useEffect(() => {
        if (status === 'unauthenticated') {
            // Redirect to login page if not authenticated
            router.push('/login');
        }
    }, [router, status]);

    // ดึงข้อมูลพนักงานที่ต้องการแก้ไข
    useEffect(() => {
        // Only fetch if authenticated
        if (status !== 'authenticated' || !employeeId) {
            setIsLoading(false); // Stop loading if not authenticated
            return;
        }

        const fetchEmployee = async () => {
            setIsLoading(true);
            setError('');

            try {
                const response = await fetch(`/api/google-sheets/${employeeId}`, {
                    method: 'GET',
                    cache: 'no-store',
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setEmployee({
                            id: data[0],
                            name: data[1],
                            position: data[2],
                            department: data[3],
                            createdAt: data[4],
                            image: data[5],
                        });
                    } else {
                        setError('ไม่พบข้อมูลพนักงานที่มีรหัส {employeeId}');
                    }
                } else {
                    setError('ไม่สามารถดึงข้อมูลพนักงานได้');
                }
            } catch (err) {
                setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
                console.error('Fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        // if (employeeId) {
        fetchEmployee();
        // }
    }, [employeeId, status]);

    // ฟังก์ชันบันทึกการแก้ไข
    const handleSave = async (formData: EmployeeFormData) => {
        setIsSaving(true);
        setError('');

        try {
            const response = await fetch(`/api/google-sheets/${employeeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    createdAt: employee?.createdAt // รักษาวันที่สร้างเดิม
                }),
            });

            if (response.ok) {
                router.push('/dashboard?updated=true');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
            }
        } catch (err) {
            setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
            console.error('Update error:', err);
        } finally {
            setIsSaving(false);
        }
    };

    // ถ้ายังไม่ได้ล็อกอิน
    if (status === 'loading' || status === 'unauthenticated') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md w-96 text-center">

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

    // ระหว่างโหลดข้อมูล
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <LoadingSpinner />
                <p className="ml-4 text-gray-600">กำลังโหลดข้อมูลพนักงาน...</p>
            </div>
        );
    }

    // กรณีไม่พบข้อมูลพนักงาน
    if (error || !employee) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md w-96 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-red-600">เกิดข้อผิดพลาด</h2>
                    <p className="mb-6">{error || 'ไม่พบข้อมูลพนักงาน'}</p>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => router.back()}
                            className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                        >
                            ย้อนกลับ
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            ไปหน้าหลัก
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">แก้ไขข้อมูลพนักงาน</h1>

                    <div className="space-x-3">
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            ย้อนกลับ
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
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h2 className="text-lg font-bold text-blue-800 mb-2">ข้อมูลเดิม</h2>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><span className="font-medium">รหัสพนักงาน:</span> {employee.id}</div>
                            <div><span className="font-medium">ชื่อ-นามสกุล:</span> {employee.name}</div>
                            <div><span className="font-medium">ตำแหน่ง:</span> {employee.position}</div>
                            <div><span className="font-medium">แผนก:</span> {employee.department}</div>
                            <div><span className="font-medium">วันที่บันทึก:</span> {new Date(employee.createdAt).toLocaleDateString('th-TH')}</div>
                        </div>
                    </div>

                    <EmployeeForm
                        initialData={{
                            id: employee.id,
                            name: employee.name,
                            position: employee.position,
                            department: employee.department,
                            image: employee.image
                        }}
                        onSubmit={handleSave}
                        isSubmitting={isSaving}
                        isEdit={true} // กำหนดว่าเป็นโหมดแก้ไขข้อมูล
                    />

                    {error && (
                        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}