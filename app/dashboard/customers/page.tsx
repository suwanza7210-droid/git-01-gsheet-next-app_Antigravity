'use client';
import DynamicTable from '@/components/DynamicTable';

export default function CustomersPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">จัดการข้อมูลลูกค้า</h1>
            <DynamicTable
                tabName="Customers"
                title="รายการลูกค้าทั้งหมด"
            />
        </div>
    );
}
