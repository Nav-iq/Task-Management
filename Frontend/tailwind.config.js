/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8bf70e",
        secondary: "#ff1b44",
        tertiary: "#110ab4",
        bg: "#9f9bca",
        text: "#000",
        gray: "#D1D1D1D9",
      },
      boxShadow: {
        "3xl": "0px 4px 4px -1px #00000040",
      },
      screens: {
        "4xl": "1921px",
        "3xl": "1681px",
        xsm: "480px",
        xxsm: "360px",
        xxxsm: "319px",
      },
      animation: {
        bounces: "bounce 3s linear",
      },
      keyframes: {
        bounce: {
          "0%, 100%": {
            transform: "translateY(-25%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
      },
    },
  },
  plugins: [],
};
