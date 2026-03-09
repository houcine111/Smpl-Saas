/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // L'IA utilisera automatiquement la bonne police selon la langue
                sans: ['Geist', 'Readex Pro', 'sans-serif'],
                dashboard: ['Geist', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
