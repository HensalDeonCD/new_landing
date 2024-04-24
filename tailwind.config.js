/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      boxShadow: {
        custom: "rgba(0, 0, 0, 0.2) 0px 2px 14px -6px",
        green: "rgba(38, 222, 129, 0.6784313725) 0px 0px 15px 0px",
        red: "rgba(255, 35, 31, 0.6784313725) 0px 0px 15px 0px",
      },
      screens: {
        xm: "450px",
      },
      maxWidth: {
        "8xl": "1440px",
      },
      fontSize: {
        md: "1rem",
      },
      colors: {
        customg: "#26de81",
        customr: "#ff231f",
      },
      keyframes: {
        slideRight: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        slideDown: {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        slideUp: {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-100%)" },
        },
        slideLeft: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
      },
      animation: {
        slideRight: "slideRight 15s linear infinite",
        slideDown: "slideDown 15s linear infinite",
        slideUp: "slideUp 15s linear infinite",
        slideLeft: "slideLeft 15s linear infinite",
      },
      writingMode: {
        'vertical-rl': 'vertical-rl',
      },
    },
  },
  plugins: [],
};
