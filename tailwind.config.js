/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
    },
    extend: {
      colors: {
        lightGreen: "#e5f4ec",
        darkGreen: "#adbcb0",
        lightBlack: "#594d54",
        darkBlack: "#170d1b",
        lightYellow: "#c39870",
        darkYellow: "#f54c01",
        lightRed: "#e0544b",
      },
    },
  },
  plugins: [],
};
