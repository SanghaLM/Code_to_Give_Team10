/** @type {import('tailwindcss').Config} */
export default {
content: [
'./index.html',
'./src/**/*.{js,ts,jsx,tsx}',
],
theme: {
extend: {
colors: {
brand: {
50: '#eef6ff',
100: '#d9ebff',
200: '#b6d7ff',
300: '#8bbfff',
400: '#5aa1ff',
500: '#2f7fff', // 主色 (藍)
600: '#1e65e6',
700: '#1a50b4',
800: '#183f8a',
900: '#162f66',
},
},
boxShadow: {
soft: '0 10px 25px rgba(16,24,40,0.06)',
},
borderRadius: {
xl2: '1rem',
},
},
},
plugins: [],
}
