/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primaryColor: "#2CA3A8",
      secondaryColor: "#FFC0CB",
      secondaryVariantColor: "#EB8899",
      primaryTextColor: "#FFF0F5",
      secondaryTextColor: "#1B2020",
      bgColor: "#1B2020",
      secondaryBgColor: "#333838",
      inputFieldColor: "#AFC2C3",
      accentColor: "#FFD700",
      labelColor: "#FF69B4",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateColumns: {
        gridContent:
          "[full-start] var(--full) [feature-start] var(--feature) [content-start] var(--content) [content-end] var(--feature) [feature-end] var(--full) [full-end]",
      },
      ringOffsetWidth: {
        2: "2px",
      },
      ringWidth: {
        2: "2px",
      },
    },
  },
  variants: {
    extend: {
      ringWidth: ["focus"],
      ringOffsetWidth: ["focus"],
      ringColor: ["focus"],
    },
  },
  plugins: [],
};
