'use client';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
    const { data: session } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const user = session?.user;
    const userName = user?.name || 'User';
    const userEmail = user?.email || 'user@example.com';
    const userImage = user?.image;

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

                {/* Title */}
                <h2 className="ml-4 text-lg font-semibold text-gray-700 hidden sm:block">
                    ยินดีต้อนรับ, {userName}
                </h2>
            </div>

            <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                {/* User Profile */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors focus:outline-none"
                    >
                        <div className="h-10 w-10 rounded-full bg-blue-500 overflow-hidden border border-gray-200 flex items-center justify-center text-white font-bold shrink-0">
                            {userImage ? (
                                <img src={userImage} alt={userName} className="h-full w-full object-cover" />
                            ) : (
                                <span>{userName.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <span className="hidden md:block text-sm font-medium text-gray-700">{userName}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={`w-4 h-4 text-gray-500 hidden md:block transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 ease-out origin-top-right">
                            {/* User Info Section */}
                            <div className="px-4 py-4 border-b border-gray-100 flex items-center space-x-3">
                                <div className="h-12 w-12 rounded-full bg-blue-500 overflow-hidden border border-gray-200 flex items-center justify-center text-white font-bold shrink-0">
                                    {userImage ? (
                                        <img src={userImage} alt={userName} className="h-full w-full object-cover" />
                                    ) : (
                                        <span>{userName.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                                <a href="#" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                    ดูโปรไฟล์
                                </a>
                                <a href="#" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                    ตั้งค่าบัญชี
                                </a>
                            </div>

                            {/* Separator */}
                            <div className="border-t border-gray-100 my-1"></div>

                            {/* Logout */}
                            <div className="py-2">
                                <button
                                    onClick={() => signOut({ callbackUrl: '/login' })}
                                    className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 2.062-2.062a.75.75 0 0 0 0-1.062L15.75 12" />
                                    </svg>
                                    ออกจากระบบ
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
