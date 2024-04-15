/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    important: true,
    content: [
        // Or if using `src` directory:
        './src/**/*.{html,js,ts,jsx,tsx,mdx}',
    ],
    corePlugins: {
      preflight: false,
    },  
    theme: {
        extend: {
            colors: {
                // 'blue-black'    : '#131233',
                'blue-black': '#1e233e',
                'blue-black-50': '#02172cb0',
                'blue-black-100': '#1e233e',
                'blue-black-200': '#152244',
                'vivid-pink': '#DA0C91',
                'vivid-blue': '#1890ff',
                'blue-magento': '#4a319d',
                'black-dark': '#5b5b5b',
                'blue-dark': '#001529',
            },
        },
    },
    plugins: [],
};
