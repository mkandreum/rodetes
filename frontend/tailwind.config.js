/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        screens: {
            'xs': '475px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        },
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
            },
            animation: {
                'slide-up': 'slide-up 0.4s ease-out',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
            }
        },
    },
    plugins: [],
}
