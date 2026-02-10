/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2563eb', // blue-600
                    600: '#2563eb',
                    500: '#3b82f6',
                },
                surface: '#0f172a', // slate-900 like
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
            },
            boxShadow: {
                card: '0 6px 18px rgba(15, 23, 42, 0.08)',
            },
        },
    },
    plugins: [],
};
