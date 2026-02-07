'use client';
import DynamicTable from '@/components/DynamicTable';

export default function AppointmentsPage() {
    const columns = [
        { key: 'customerName', label: 'ชื่อลูกค้า' },
        { key: 'dentistName', label: 'ทันตแพทย์' }, // Maps to col2
        { key: 'time', label: 'เวลานัดหมาย' }   // Maps to col3
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">ตารางนัดหมาย</h1>
            <DynamicTable
                tabName="Appointments"
                title="รายการนัดหมาย"
                columns={columns}
            />
        </div>
    );
}
