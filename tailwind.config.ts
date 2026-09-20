import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        paper: "#f5f7fb",
        line: "#dfe5ef",
        accent: "#3056d3",
      },
      boxShadow: {
        card: "0 12px 32px rgba(23, 32, 51, 0.07)",
      },
    },
  },
  plugins: [],
};

export default config;
