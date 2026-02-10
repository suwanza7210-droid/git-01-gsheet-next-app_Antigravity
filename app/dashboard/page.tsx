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

    // Stat Card Component
    const StatCard = ({
        label,
        value,
        icon,
        iconBg,
        iconColor,
        trend
    }: {
        label: string;
        value: number;
        icon: React.ReactNode;
        iconBg: string;
        iconColor: string;
        trend?: { value: string; positive: boolean };
    }) => (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{value.toLocaleString()}</p>
                {trend && (
                    <p className={`text-xs mt-2 flex items-center ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                        {trend.positive ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        )}
                        {trend.value}
                    </p>
                )}
            </div>
            <div className={`${iconBg} p-3 rounded-full ${iconColor}`}>
                {icon}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">ภาพรวม (Dashboard)</h1>
                <p className="text-gray-500 mt-1">ยินดีต้อนรับสู่ระบบ CRM บริหารจัดการคลินิก</p>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="ลูกค้าทั้งหมด"
                    value={stats.customers}
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                        </svg>
                    }
                />

                <StatCard
                    label="นัดหมายทั้งหมด"
                    value={stats.appointments}
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                    }
                />

                <StatCard
                    label="ทันตแพทย์"
                    value={stats.dentists}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    }
                />

                <StatCard
                    label="รายการรักษา"
                    value={stats.treatments}
                    iconBg="bg-orange-100"
                    iconColor="text-orange-600"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    }
                />
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Menu Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">เมนูลัด</h3>
                    <div className="space-y-3">
                        <Link href="/dashboard/customers" className="flex items-center w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg transition-colors border border-gray-200 hover:border-blue-200 group">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                            <span className="font-medium">จัดการข้อมูลลูกค้า</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-auto text-gray-400 group-hover:text-blue-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                        <Link href="/dashboard/appointments" className="flex items-center w-full text-left px-4 py-3 bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-700 rounded-lg transition-colors border border-gray-200 hover:border-green-200 group">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-gray-400 group-hover:text-green-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                            <span className="font-medium">ดูตารางนัดหมายวันนี้</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-auto text-gray-400 group-hover:text-green-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                        <Link href="/dashboard/dentists" className="flex items-center w-full text-left px-4 py-3 bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-700 rounded-lg transition-colors border border-gray-200 hover:border-purple-200 group">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-gray-400 group-hover:text-purple-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            <span className="font-medium">จัดการข้อมูลทันตแพทย์</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-auto text-gray-400 group-hover:text-purple-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Welcome Card */}
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-white/5 rounded-full"></div>

                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">ยินดีต้อนรับสู่ CRM Pro</h3>
                        <p className="text-blue-100 text-sm leading-relaxed">ระบบบริหารจัดการที่ออกแบบมาเพื่อคลินิกทันตกรรมโดยเฉพาะ พร้อมฟีเจอร์ครบครัน</p>
                    </div>
                    <div className="mt-6 relative z-10">
                        <button className="bg-white text-blue-600 px-5 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-md">
                            ดูคู่มือการใช้งาน
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}