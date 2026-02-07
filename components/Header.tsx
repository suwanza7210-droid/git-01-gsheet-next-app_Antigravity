'use client';
import { useSession, signOut } from 'next-auth/react';

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
    const { data: session } = useSession();

    return (
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
            <div className="flex items-center">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>

                {/* Breadcrumb or Title placeholder */}
                <h2 className="ml-4 text-lg font-semibold text-gray-700 hidden sm:block">
                    ยินดีต้อนรับ, {session?.user?.name || 'User'}
                </h2>
            </div>

            <div className="flex items-center space-x-4">
                {/* Notification Bell (Visual only) */}
                <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center space-x-3 border-l pl-4 py-1">
                    <div className="hidden md:block text-right">
                        <div className="text-sm font-medium text-gray-900">{session?.user?.name}</div>
                        <div className="text-xs text-gray-500">{session?.user?.role || 'Admin'}</div>
                    </div>

                    <div className="relative group cursor-pointer">
                        <div className="h-10 w-10 rounded-full bg-blue-500 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt={session.user.name || 'User'} className="h-full w-full object-cover" />
                            ) : (
                                <span>{session?.user?.name?.charAt(0) || 'U'}</span>
                            )}
                        </div>

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 hidden group-hover:block transition-all transform origin-top-right">
                            <div className="px-4 py-2 border-b">
                                <p className="text-sm text-gray-900 font-medium">ข้อมูลส่วนตัว</p>
                                <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 hover:text-red-700"
                            >
                                ออกจากระบบ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
