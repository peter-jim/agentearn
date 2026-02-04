/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                void: '#0B0F19',
                wealth: {
                    light: '#00F0FF',
                    DEFAULT: '#05D69E',
                    dark: '#059669',
                }
            }
        },
    },
    plugins: [],
}
