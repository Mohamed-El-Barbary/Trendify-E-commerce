/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./node_modules/flowbite/dist/flowbite.min.js",
  ],
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        "main-color": "var(--main-color)",
        "second-color": "var(--second-color)",
        "text-color": "var(--text-color)",
        "second-text": "var(--second-text)",
        "bg-color": "var(--bg-color)",
        "card-color": "var(--card-color)",
        "review-color": "var(--review-color)",
        "error-color": "var(--error-color)",
        "footer-color": "var(--footer-bg)",
      },
      fontFamily: {
        "header-style": "var(--header-style)",
      },
      backgroundImage: {
        panners: "url('/images/panner.png')",
        "header-bg": "url('/images/home-image/mian-bg-home.png')",
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwind-scrollbar-hide")],
};
