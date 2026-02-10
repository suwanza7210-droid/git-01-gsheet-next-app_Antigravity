'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (val: boolean) => void }) {
    const pathname = usePathname();

    const menuItems = [
        {
            name: 'ภาพรวม (Dashboard)', href: '/dashboard', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            )
        },
        {
            name: 'ลูกค้า (Customers)', href: '/dashboard/customers', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
            )
        },
        {
            name: 'ทันตแพทย์ (Dentists)', href: '/dashboard/dentists', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
            )
        },
        {
            name: 'การรักษา (Treatments)', href: '/dashboard/treatments', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            )
        },
        {
            name: 'นัดหมาย (Appointments)', href: '/dashboard/appointments', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
            )
        },
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto`}>
            {/* Logo Section */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-lg font-bold text-white">C</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800 tracking-tight">ระบบ CRM</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Navigation */}
            <nav className="mt-6 px-3 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.name} 
                            href={item.href} 
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 border-l-4 ${
                                isActive 
                                    ? 'bg-blue-50 border-l-blue-500 text-blue-600' 
                                    : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <span className={isActive ? 'text-blue-500' : 'text-gray-400'}>{item.icon}</span>
                            <span className="ml-3 font-medium text-sm">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-gray-50">
                <div className="text-xs text-gray-500 text-center">
                    &copy; 2026 ระบบบริหารคลินิก CRM
                </div>
            </div>
        </aside>
    );
}
