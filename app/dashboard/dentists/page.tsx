'use client';
import DynamicTable from '@/components/DynamicTable';

export default function DentistsPage() {
    const columns = [
        { key: 'name', label: 'ชื่อทันตแพทย์' },
        { key: 'specialist', label: 'ความเชี่ยวชาญ' }, // Maps to col2
        { key: 'schedule', label: 'ตารางงาน' }   // Maps to col3
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">จัดการข้อมูลทันตแพทย์</h1>
            <DynamicTable
                tabName="Dentists"
                title="รายการทันตแพทย์"
                columns={columns}
            />
        </div>
    );
}
