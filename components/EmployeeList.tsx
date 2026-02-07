import React, { useState } from 'react';
import EmployeeForm from './EmployeeForm'; // ปรับ path ตามจริง
import toast from 'react-hot-toast';

type Employee = {
    id: string;
    name: string;
    position: string;
    department: string;
    createdAt: string;
    image: string;
};

interface EmployeeListProps { // กำหนด props สำหรับ EmployeeList
    employees: Employee[];
    // onEdit: (employees: Employee, index: number) => void;
    onEdit: (employee: Employee) => void; // เปลี่ยนจาก employees เป็น employee เพื่อให้สามารถแก้ไขพนักงานได้โดยไม่ต้องรู้ index ในหน้าแสดงผล
    // onDelete: (index: number) => void;
    onDelete: (employeeId: string) => void; // เปลี่ยนจาก index เป็น employeeId เพื่อให้สามารถลบพนักงานได้โดยไม่ต้องรู้ index ในหน้าแสดงผล

    onAdd: (employee: Omit<Employee, 'createdAt'>) => void; // เพิ่ม props สำหรับการเพิ่มพนักงาน
    // setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>; // เพิ่ม props สำหรับการตั้งค่า state ของพนักงาน
    // วันที่โค้ดนี้เขียนขึ้น ยังไม่มีการใช้ pagination
    currentPage: number; // เพิ่ม props สำหรับหน้าแสดงผลปัจจุบัน    
    totalPages: number;  // เพิ่ม props สำหรับจำนวนหน้าทั้งหมด
    onPageChange: (page: number) => void; // เพิ่ม props สำหรับการเปลี่ยนหน้า
}

const EmployeeList: React.FC<EmployeeListProps> = ({
    employees,
    onEdit,
    onDelete, // ฟังก์ชันลบพนักงาน
    onAdd,    // 
    // setEmployees, // ฟังก์ชันสำหรับอัปเดตข้อมูลพนักงาน
    currentPage,     // หน้าแสดงผลปัจจุบัน
    totalPages,      // จำนวนหน้าทั้งหมด
    onPageChange,    // ฟังก์ชันสำหรับเปลี่ยนหน้า 
}) => {

    // Modal สำหรับเพิ่มพนักงาน
    const [showAddModal, setShowAddModal] = useState(false);
    // Modal สำหรับแก้ไขพนักงาน
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    // const [editingIndex, setEditingIndex] = useState<number | null>(null);
    // State สำหรับการบันทึกข้อมูล
    const [isSaving, setIsSaving] = useState(false);

    // const [employees, setEmployees] = useState<Employee[]>([]); // ถ้าต้องการจัดการ state ของพนักงานในคอมโพเนนต์นี้
    //-------------------------------------------

    // เปิด Modal เพิ่ม
    const handleAddClick = () => {
        setShowAddModal(true);
    };

    // บันทึกข้อมูลใหม่
    const handleAddSave = async (formData: Omit<Employee, 'createdAt'>) => {
        // ตรวจสอบรหัสพนักงานซ้ำ (เฉพาะตอนเพิ่มข้อมูลใหม่)
        if (employees.some(emp => emp.id.trim() === formData.id.trim())) {
            toast.error('รหัสพนักงานนี้มีอยู่แล้วในระบบ');
            // return; // หยุดการทำงานถ้าพบรหัสซ้ำ
            // โยน Error เพื่อให้ EmployeeForm จัดการแสดงข้อความผิดพลาด
            throw new Error('รหัสพนักงานนี้มีอยู่แล้วในระบบ');
        }

        setIsSaving(true);
        await onAdd(formData);
        setIsSaving(false);
        setShowAddModal(false);
    };

    // เปิด Modal แก้ไข
    const handleEditClick = (employee: Employee) => {
        setEditingEmployee(employee);
        setShowEditModal(true);
    };

    // บันทึกการแก้ไข
    const handleEditSave = async (formData: Omit<Employee, 'createdAt'>) => {
        if (editingEmployee) {
            setIsSaving(true);
            await onEdit({ ...editingEmployee, ...formData });
            setIsSaving(false);
            setShowEditModal(false);
        }
    };

    return (
        // <div className="w-full max-w-4xl mx-auto bg-white p-4 rounded-lg shadow">
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">รายชื่อพนักงาน</h1>
            <div className="mb-4">
                <button
                    // onClick={() => setShowModal(true)}
                    onClick={handleAddClick}
                    // onClick={() => setShowAddModal(true)}
                    // onClick={() => handleEdit(emp, idx)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    เพิ่มพนักงาน
                </button>
            </div>

            <div className="w-full rounded-lg shadow">
                {/* <table className="min-w-full bg-white"> */}
                <table className="w-full bg-white">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b text-left">รหัส</th>
                            <th className="px-4 py-2 border-b text-left">ชื่อ</th>
                            <th className="px-4 py-2 border-b text-left">ตำแหน่ง</th>
                            <th className="px-4 py-2 border-b text-left">แผนก</th>
                            <th className="px-4 py-2 border-b text-left">วันที่บันทึก</th>
                            <th className="px-4 py-2 border-b text-left">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* ใช้ currentEmployees แทน employees ในการ map แสดงผล */}
                        {/* {currentEmployees.map((emp, idx) => ( */}
                        {/* {employees.map((emp, idx) => ( */}
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border-b">{emp.id}</td>
                                <td className="px-4 py-2 border-b">{emp.name}</td>
                                <td className="px-4 py-2 border-b">{emp.position}</td>
                                <td className="px-4 py-2 border-b">{emp.department}</td>
                                <td className="px-4 py-2 border-b">{new Date(emp.createdAt).toLocaleDateString('th-TH')}</td>
                                <td className="px-4 py-2 border-b">
                                    <button
                                        // onClick={() => handleEditClick(emp, idx)}
                                        onClick={() => handleEditClick(emp)}
                                        className="text-blue-500 hover:underline mr-2"
                                    >
                                        แก้ไข
                                    </button>
                                    <button
                                        // onClick={() => onDelete(idx)}
                                        onClick={() => onDelete(emp.id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        ลบ
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* --- BEGIN Modal------------------------------------------------------- */}
                {/* Modal เพิ่ม */}
                {showAddModal && (
                    // <div className="w-full max-w-4xl mx-auto bg-white p-4 rounded-lg shadow">
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                            <h2 className="text-lg font-bold mb-4">เพิ่มพนักงานใหม่</h2>
                            <EmployeeForm
                                initialData={{ id: '', name: '', position: '', department: '', image: '' }}
                                onSubmit={handleAddSave}
                                isSubmitting={isSaving}
                                isEdit={false} // กำหนดว่าเป็นโหมดเพิ่มข้อมูล
                            />
                            <div className="flex justify-end mt-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded mr-2"
                                    onClick={() => setShowAddModal(false)}
                                    disabled={isSaving}
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal แก้ไข */}
                {showEditModal && editingEmployee && (
                    // <div className="w-full max-w-4xl mx-auto bg-white p-4 rounded-lg shadow">
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                            <h2 className="text-lg font-bold mb-4">แก้ไขข้อมูลพนักงาน</h2>
                            <EmployeeForm
                                initialData={{
                                    id: editingEmployee.id,
                                    name: editingEmployee.name,
                                    position: editingEmployee.position,
                                    department: editingEmployee.department,
                                    image: editingEmployee.image,
                                }}
                                onSubmit={handleEditSave}  // ส่งฟังก์ชันบันทึกการแก้ไข
                                isSubmitting={isSaving}    // ส่ง isSaving เพื่อป้องกันการส่งข้อมูลซ้ำ
                                isEdit={true}              // กำหนดว่าเป็นโหมดแก้ไขข้อมูล
                            />
                            <div className="flex justify-end mt-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded mr-2"
                                    onClick={() => setShowEditModal(false)} // ปิด Modal แก้ไข 
                                    disabled={isSaving} // ปุ่มยกเลิก disabled เมื่อกำลังบันทึกข้อมูล  
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* --- END Modal------------------------------------------------------- */}

                {/* --- BEGIN การแบ่งหน้า -------------------------------------------------*/}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <nav className="inline-flex">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    className={`px-3 py-1 mx-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    onClick={() => onPageChange(i + 1)}
                                    disabled={currentPage === i + 1}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </nav>
                    </div>
                )}
                {/* --- END การแบ่งหน้า ---------------------------------------------------*/}

            </div>
        </div>
    );
};
export default EmployeeList;