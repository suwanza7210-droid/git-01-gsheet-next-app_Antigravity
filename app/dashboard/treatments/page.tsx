'use client';
import DynamicTable from '@/components/DynamicTable';

export default function TreatmentsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">ข้อมูลการรักษา</h1>
            <DynamicTable
                tabName="Treatments"
                title="รายการบริการ"
            />
        </div>
    );
}
