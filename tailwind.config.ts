import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#372a21",
        paper: "#faf7ee",
        line: "#ded7c9",
        accent: "#8b4c21",
      },
      boxShadow: {
        card: "0 3px 0 #e4ded1",
      },
    },
  },
  plugins: [],
};

export default config;
