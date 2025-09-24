/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Outfit: ["Outfit", "sans-serif"],
        Ovo: ["Ovo", "serif"],
      },colors: {
        lightHover: "#fcf4ff",
        darkHover: "#2a004a",
        darkTheme: "#11001F",
        darkPrimary: "#1c0033",
        darkSecondary: "#270046",
        darkTertiary: "#31005a",
        darkContainer: "#161622",
        darkContainerHover: "#4d0090",
        darkCard: "#25233A",
        darkCardHover: "#2A2A40",
      },
      boxShadow: {
        black: "4px 4px 0 #000",
        white: "4px 4px 0 #fff",
      },
    },
  },
  darkMode:'selector',
  plugins: [],
}