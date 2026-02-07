'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface EmployeeFormProps {
    initialData: {
        id: string;
        name: string;
        position: string;
        department: string;
        image: string;
    };
    onSubmit: (formData: { id: string; name: string; position: string; department: string; image: string; }) => Promise<void>;
    isSubmitting: boolean;
    isEdit?: boolean;
    existingIds?: string[];
}

/**
 * คอมโพเนนต์สำหรับฟอร์มเพิ่ม/แก้ไขข้อมูลพนักงาน
 * @param initialData - ข้อมูลเริ่มต้นสำหรับฟอร์ม (ใช้ในโหมดแก้ไข)
 * @param onSubmit - ฟังก์ชันที่จะถูกเรียกเมื่อฟอร์มถูกส่ง
 * @param isSubmitting - สถานะการส่งข้อมูล (เพื่อปิดปุ่ม)
 * @param isEdit - ระบุว่าเป็นโหมดแก้ไขหรือไม่
 * @param existingIds - รายการรหัสพนักงานที่มีอยู่ เพื่อใช้ตรวจสอบรหัสซ้ำฝั่ง Client
 */
const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSubmit, isSubmitting, isEdit, existingIds }) => {
    const router = useRouter();
    const [formData, setFormData] = useState(initialData);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    /**
     * จัดการการเปลี่ยนแปลงค่าใน input fields
     * และล้างค่า error เมื่อมีการแก้ไขรหัสพนักงาน
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'id') {
            setError('');
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * จัดการการส่งฟอร์ม (submit)
     * 1. ตรวจสอบข้อมูลเบื้องต้น
     * 2. ตรวจสอบรหัสพนักงานซ้ำ (Client-side)
     * 3. เรียกใช้ฟังก์ชัน onSubmit ที่ได้รับจาก props เพื่อส่งข้อมูลไป API
     * 4. จัดการกับผลลัพธ์ (แสดง Modal เมื่อสำเร็จ หรือแสดง Error เมื่อล้มเหลว)
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 1. ตรวจสอบข้อมูลเบื้องต้น
        if (!formData.id || !formData.name || !formData.position || !formData.department || !formData.image) {
            setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
            return;
        }

        // 2. ตรวจสอบรหัสพนักงานซ้ำ (เฉพาะตอนเพิ่มข้อมูลใหม่) โดยไม่คำนึงถึงตัวพิมพ์เล็ก-ใหญ่
        if (!isEdit && existingIds && existingIds.map(id => id.toLowerCase().trim()).includes(formData.id.toLowerCase().trim())) {
            setError('รหัสพนักงานนี้มีอยู่แล้ว กรุณาใช้รหัสอื่น');
            return;
        }

        try {
            // 3. เรียกใช้ฟังก์ชัน onSubmit จาก parent component
            await onSubmit(formData);

            // 4. เมื่อสำเร็จ แสดง Success Modal
            setShowSuccessModal(true);

            // หากเป็นการเพิ่มข้อมูลใหม่ ให้ล้างฟอร์ม
            if (!isEdit) {
                setFormData({ id: '', name: '', position: '', department: '', image: '' });
            }
        } catch (err) {
            // 4. หากล้มเหลว แสดงข้อความ error ที่ได้รับจาก parent component
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('เกิดข้อผิดพลาดที่ไม่รู้จัก');
            }
            console.error('Submission error:', err);
        }
    };

    // ใช้ useEffect เพื่อรีเซ็ตข้อมูลฟอร์มเมื่อ initialData เปลี่ยน (สำหรับโหมดแก้ไข)
    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    return (
        <div>
            <h2 id="employee-form-title" className="text-xl font-bold mb-4">แบบฟอร์มบันทึกข้อมูลพนักงาน</h2>

            {error && (
                <div id="employee-form-error" className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} aria-labelledby="employee-form-title" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="emp-id" className="block text-gray-700 mb-2 font-medium">
                            รหัสพนักงาน <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="emp-id"
                            type="text"
                            name="id"
                            value={formData.id.trim()}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="เช่น EMP001"
                            required
                            disabled={isEdit}
                            autoComplete="off"
                            aria-invalid={!!error}
                            aria-describedby={error ? 'employee-form-error' : undefined}
                        />
                    </div>

                    <div>
                        <label htmlFor="emp-name" className="block text-gray-700 mb-2 font-medium">
                            ชื่อ-นามสกุล <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="emp-name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="เช่น สมชาย ใจดี"
                            required
                            autoComplete="name"
                            aria-invalid={!!error}
                            aria-describedby={error ? 'employee-form-error' : undefined}
                        />
                    </div>

                    <div>
                        <label htmlFor="emp-position" className="block text-gray-700 mb-2 font-medium">
                            ตำแหน่ง <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="emp-position"
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="เช่น พนักงานขาย"
                            required
                            autoComplete="organization-title"
                            aria-invalid={!!error}
                            aria-describedby={error ? 'employee-form-error' : undefined}
                        />
                    </div>

                    <div>
                        <label htmlFor="emp-department" className="block text-gray-700 mb-2 font-medium">
                            แผนก <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="emp-department"
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="เช่น การตลาด"
                            required
                            autoComplete="organization"
                            aria-invalid={!!error}
                            aria-describedby={error ? 'employee-form-error' : undefined}
                        />
                    </div>

                    <div>
                        <label htmlFor="emp-image" className="block text-gray-700 mb-2 font-medium">
                            Image URL <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="emp-image"
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="เช่น https://example.com/image.png"
                            required
                            autoComplete="off"
                            aria-invalid={!!error}
                            aria-describedby={error ? 'employee-form-error' : undefined}
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        id="emp-reset"
                        onClick={() => setFormData({ id: '', name: '', position: '', department: '', image: '' })}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        disabled={isSubmitting || isEdit}
                        aria-disabled={isSubmitting || isEdit}
                    >
                        ล้างข้อมูล
                    </button>

                    <button
                        type="submit"
                        id="emp-submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 rounded-lg text-white ${isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600'
                            }`}
                        aria-busy={isSubmitting}
                        aria-disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                กำลังบันทึก...
                            </span>
                        ) : (
                            'บันทึกข้อมูล'
                        )}
                    </button>
                </div>
            </form>

            {/* ====== Success Modal ====== */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white w-80 p-6 rounded-lg shadow-lg text-center">
                        <h3 className="text-lg font-semibold mb-4">
                            บันทึกข้อมูลเรียบร้อยแล้ว
                        </h3>
                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                router.push('/dashboard');
                            }}
                            className="mt-2 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            ตกลง
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default EmployeeForm;