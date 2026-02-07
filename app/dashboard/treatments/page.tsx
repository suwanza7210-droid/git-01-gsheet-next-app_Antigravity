'use client';
import DynamicTable from '@/components/DynamicTable';

export default function TreatmentsPage() {
    const columns = [
        { key: 'treatmentName', label: 'ชื่อการรักษา' },
        { key: 'price', label: 'ราคามาตรฐาน' }, // Maps to col2
        { key: 'duration', label: 'ระยะเวลา (นาที)' }   // Maps to col3
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">ข้อมูลการรักษา</h1>
            <DynamicTable
                tabName="Treatments"
                title="รายการบริการ"
                columns={columns}
            />
        </div>
    );
}
