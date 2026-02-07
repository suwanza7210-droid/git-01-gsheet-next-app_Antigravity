'use client';
import DynamicTable from '@/components/DynamicTable';

export default function CustomersPage() {
    const columns = [
        { key: 'name', label: 'ชื่อ-นามสกุล' },
        { key: 'phone', label: 'เบอร์โทรศัพท์' }, // Maps to col2
        { key: 'email', label: 'อีเมล/ที่อยู่' }   // Maps to col3
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
