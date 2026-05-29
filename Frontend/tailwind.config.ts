import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        panel: "#111827",
        brand: "#2563eb",
        line: "#e5e7eb",
        paper: "#fbf9fa"
      },
      boxShadow: {
        soft: "0 18px 40px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
