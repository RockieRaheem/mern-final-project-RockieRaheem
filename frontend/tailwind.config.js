/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1193d4",
        "background-light": "#f6f7f8",
        "background-dark": "#101c22",
        "card-light": "#ffffff",
        "card-dark": "#17262e",
        "text-light-primary": "#111618",
        "text-dark-primary": "#ffffff",
        "text-light-secondary": "#617c89",
        "text-dark-secondary": "#a0b3bd",
        "border-light": "#dbe2e6",
        "border-dark": "#364853",
        "surface-light": "#f0f3f4",
        "surface-dark": "#2a3b45",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
