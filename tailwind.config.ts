import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#202124",
        paper: "#fafaf8",
        line: "#e3e5e8",
        accent: "#ad390d",
      },
      boxShadow: {
        card: "0 4px 24px #20212408",
      },
    },
  },
  plugins: [],
};

export default config;
