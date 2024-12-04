/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        MICRO: ['"Micro 5"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
