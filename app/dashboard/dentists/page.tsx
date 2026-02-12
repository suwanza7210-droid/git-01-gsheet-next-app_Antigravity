'use client';
import DynamicTable from '@/components/DynamicTable';

export default function DentistsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">จัดการข้อมูลทันตแพทย์</h1>
            <DynamicTable
                tabName="Dentists"
                title="รายการทันตแพทย์"
            />
        </div>
    );
}
