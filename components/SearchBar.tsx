import React from 'react';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
    id?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    searchTerm,
    onSearchChange,
    placeholder = "ค้นหา...",
    id = "search",
}) => {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </div>
            <input
                id={id}
                name="search"
                type="search"
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                          placeholder-gray-400 transition-colors text-sm"
                placeholder={placeholder}
                autoComplete="off"
                aria-label={placeholder}
            />
        </div>
    );
};

export default SearchBar;
