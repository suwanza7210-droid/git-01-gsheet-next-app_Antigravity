'use client';
import DynamicTable from '@/components/DynamicTable';

export default function CustomersPage() {
    // Option 1: ไม่กำหนด columns → จะแสดงทุก column จาก Google Sheets (ยกเว้น ID)
    // return (
    //     <div className="space-y-6">
    //         <h1 className="text-3xl font-bold text-gray-800">จัดการข้อมูลลูกค้า</h1>
    //         <DynamicTable
    //             tabName="Customers"
    //             title="รายการลูกค้าทั้งหมด"
    //         />
    //     </div>
    // );

    // Option 2: กำหนด columns → เลือกแค่ column ที่ต้องการแสดง
    // ใช้ headerName เพื่ออ้างอิงชื่อ column จาก Google Sheets
    const columns = [
        { headerName: 'Name', label: 'ชื่อ-นามสกุล' },
        { headerName: 'Phone', label: 'เบอร์โทรศัพท์' },
        { headerName: 'Email', label: 'อีเมล' }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">จัดการข้อมูลลูกค้า</h1>
            <DynamicTable
                tabName="Customers"
                title="รายการลูกค้าทั้งหมด"
                columns={columns}
            />
        </div>
    );
}
