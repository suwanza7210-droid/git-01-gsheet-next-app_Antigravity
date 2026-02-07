import React, { useState, useEffect } from 'react';
// import Image from 'next/image'; // next/image ต้องการ width และ height
import { Employee } from '@/app/dashboard/page'; // นำเข้า interface Employee จากหน้า dashboard
// interface คือการกำหนดรูปแบบของ props ที่จะส่งเข้าไปในคอมโพเนนต์ EmployeeCard
//- อธิบาย: interface ใช้เพื่อกำหนดรูปแบบของ props ที่คอมโพเนนต์จะรับ
// employee: Employee; รับอ็อบเจกต์ข้อมูลพนักงาน 1 คน (ชนิด Employee) เพื่อแสดงรายละเอียดใน card
// onEdit: () => void; รับฟังก์ชันสำหรับเรียกเมื่อผู้ใช้กดปุ่ม "แก้ไข" (ไม่มี argument และไม่คืนค่า)
// onDelete: () => void; รับฟังก์ชันสำหรับเรียกเมื่อผู้ใช้กดปุ่ม "ลบ" (ไม่มี argument และไม่คืนค่า)
//- สรุป: interface ช่วยให้เราสามารถกำหนดรูปแบบของข้อมูลที่คอมโพเนนต์จะรับได้อย่างชัดเจน
// interface นี้ช่วยให้ TypeScript ตรวจสอบว่าคุณส่ง props ที่ถูกต้องให้กับคอมโพเนนต์ EmployeeCard เสมอ
interface EmployeeCardProps {
    employee: Employee;   // prop สำหรับข้อมูลพนักงาน (ชนิด Employee)
    onEdit: () => void;   // เพิ่ม prop สำหรับฟังก์ชันแก้ไขข้อมูล (ไม่มี argument)
    onDelete: () => void; // เพิ่ม prop สำหรับฟังก์ชันลบข้อมูล (ไม่มี argument)
}

// รูปภาพสำรองที่เก็บไว้ในโปรเจกต์ (ในโฟลเดอร์ public/images/)
// วิธีนี้เสถียรกว่าการใช้ Google Drive
const FALLBACK_IMAGE_URL = '/images/default-avatar.png';
// const FALLBACK_IMAGE_URL = 'https://drive.google.com/thumbnail?id=1WbyK_xyz1kIV4wJDqI3QXOI2gkNNC0Ae';

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onEdit, onDelete }) => {
    // ใช้ state เพื่อจัดการ URL ของรูปภาพ และสลับไปใช้ fallback เมื่อโหลดพลาด
    const [imageSrc, setImageSrc] = useState(employee.image || FALLBACK_IMAGE_URL);

    // อัปเดต state เมื่อ prop `employee` เปลี่ยนแปลง
    useEffect(() => {
        setImageSrc(employee.image || FALLBACK_IMAGE_URL);
    }, [employee.image]);

    const handleError = () => {
        setImageSrc(FALLBACK_IMAGE_URL);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative w-full h-48">
                <img
                    src={imageSrc}
                    alt={employee.name}
                    className={`w-full h-48 ${imageSrc !== FALLBACK_IMAGE_URL ? 'object-cover' : 'object-contain'}`}
                    onError={handleError}
                />
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{employee.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">รหัส: {employee.id}</p>
                    </div>

                    {/* ปรับปุ่มให้อยู่ชิดกันมากขึ้น */}
                    <div className="flex gap-1">
                        <button
                            onClick={onEdit}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="แก้ไขข้อมูล"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>
                        <button
                            onClick={onDelete}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="ลบข้อมูล"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M4 6h12v2H4V6zm2 2v8a2 2 0 002 2h4a2 2 0 002-2V8H6z" />
                            </svg>
                        </button>
                    </div>

                </div>

                <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                        </svg>
                        {employee.position}
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                        </svg>
                        {employee.department}
                    </div>

                    <div className="flex items-center text-xs text-gray-500 mt-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        วันที่บันทึก: {new Date(employee.createdAt).toLocaleDateString('th-TH')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeCard;