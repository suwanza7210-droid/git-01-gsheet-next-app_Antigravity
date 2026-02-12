'use client';
import DynamicTable from '@/components/DynamicTable';

export default function AppointmentsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">ตารางนัดหมาย</h1>
            <DynamicTable
                tabName="Appointments"
                title="รายการนัดหมาย"
            />
        </div>
    );
}
