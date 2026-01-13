/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                pixel: ['"VT323"', 'monospace'],
            },
            colors: {
                'rodetes-pink': '#eb2eff',
                'rodetes-blue': '#2effff',
            },
            textShadow: {
                'glow-white': '0 0 10px rgba(255, 255, 255, 0.7)',
                'glow-pink': '0 0 10px rgba(235, 46, 255, 0.7)',
            }
        },
    },
    plugins: [],
}
