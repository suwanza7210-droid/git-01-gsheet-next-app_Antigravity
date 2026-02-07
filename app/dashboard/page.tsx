'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({
        customers: 0,
        appointments: 0,
        dentists: 0,
        treatments: 0
    });

    useEffect(() => {
        // Fetch counts for widgets
        // In a real app, you might have a dedicated /api/stats endpoint.
        // For now, we fetch each tab and count (not efficient but works for MVP)
        const fetchStats = async () => {
            try {
                const [custRes, appRes, dentRes, treatRes] = await Promise.all([
                    fetch('/api/google-sheets?tab=Customers'),
                    fetch('/api/google-sheets?tab=Appointments'),
                    fetch('/api/google-sheets?tab=Dentists'),
                    fetch('/api/google-sheets?tab=Treatments')
                ]);

                const custData = await custRes.json();
                const appData = await appRes.json();
                const dentData = await dentRes.json();
                const treatData = await treatRes.json();

                setStats({
                    customers: Array.isArray(custData) ? custData.length : 0,
                    appointments: Array.isArray(appData) ? appData.length : 0,
                    dentists: Array.isArray(dentData) ? dentData.length : 0,
                    treatments: Array.isArray(treatData) ? treatData.length : 0,
                });
            } catch (error) {
                console.error("Failed to load stats", error);
            }
        };

        if (session) {
            fetchStats();
        }
    }, [session]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">ภาพรวม (Dashboard)</h1>
                <p className="text-gray-600 mt-2">ยินดีต้อนรับสู่ระบบ CRM บริหารจัดการคลินิก</p>
            </div>

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Widget 1: Customers */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">ลูกค้าทั้งหมด</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{stats.customers}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                        </svg>
                    </div>
                </div>

                {/* Widget 2: Appointment */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">นัดหมายทั้งหมด</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{stats.appointments}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                    </div>
                </div>

                {/* Widget 3: Dentists */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">ทันตแพทย์</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{stats.dentists}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </div>
                </div>

                {/* Widget 4: Treatments */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">รายการรักษา</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{stats.treatments}</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">เมนูลัด</h3>
                    <div className="space-y-3">
                        <Link href="/dashboard/customers" className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg transition-colors border border-gray-200 hover:border-blue-200">
                            จัดการข้อมูลลูกค้า
                        </Link>
                        <Link href="/dashboard/appointments" className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-700 rounded-lg transition-colors border border-gray-200 hover:border-green-200">
                            ดูตารางนัดหมายวันนี้
                        </Link>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl shadow-sm text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">ยินดีต้อนรับสู่ CRM Pro</h3>
                        <p className="text-blue-100 opacity-90">ระบบบริหารจัดการที่ออกแบบมาเพื่อคลินิกทันตกรรมโดยเฉพาะ</p>
                    </div>
                    <div className="mt-6">
                        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                            ดูคู่มือการใช้งาน
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}