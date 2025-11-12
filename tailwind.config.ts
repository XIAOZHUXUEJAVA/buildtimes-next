import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 原项目颜色系统
      colors: {
        background: "#fffff5", // 米黄色背景
        foreground: "#000", // 纯黑文字
        primary: {
          DEFAULT: "#000",
          foreground: "#fff",
        },
        secondary: {
          DEFAULT: "#F76C5E", // 珊瑚红强调色
          foreground: "#fff",
        },
        error: "tomato",
        "light-grey": "#eeeee5",
        "dark-grey": "#222222",
        border: "#d4d4d3",
      },
      
      // 字体家族
      fontFamily: {
        primary: ["Times", "serif"],
        secondary: ["AlternateGothicW01-No3", "sans-serif"],
        tertiary: ["Helvetica", "sans-serif"],
        monospace: ["Monaco", "Consolas", "Menlo", "monospace"],
        brand: ["Playfair Display", "Times", "serif"],
      },
      
      // 字重
      fontWeight: {
        light: "300",
        normal: "400",
        bold: "700",
        "ultra-bold": "900",
      },
      
      // 字号系统
      fontSize: {
        small: "16px",
        base: "20px",
        normal: "20px",
        large: "35px",
        "post-body": "20px",
        "post-body-desktop": "24px",
        "post-title": "35px",
        "feature-title": "120px",
        "feature-title-variation": "45px",
        "drop-cap": "130px",
        "drop-cap-mobile": "120px",
        "quote": "32px",
        "quote-mark": "160px",
        "code-inline": "0.75em",
      },
      
      // 行高
      lineHeight: {
        normal: "1.2",
        body: "1.5",
        "post-body": "1.6",
        "drop-cap": "53px",
        "drop-cap-mobile": "50px",
        "feature-title": "0.78",
      },
      
      // 间距系统
      spacing: {
        "post-padding": "30px",
        "post-rhythm": "25px",
        "layout-side": "35px",
        "post-background-gutter": "10px",
      },
      
      // 最大宽度
      maxWidth: {
        "post-body": "700px",
        layout: "1640px",
      },
      
      // 边框圆角
      borderRadius: {
        none: "0",
      },
      
      // 过渡动画
      transitionDuration: {
        short: "100ms",
        DEFAULT: "200ms",
        masonry: "200ms",
      },
      
      // 阴影
      boxShadow: {
        tweet: "1px 1px 2px 0px rgba(0, 0, 1, 0.25)",
      },
      
      // 字母间距
      letterSpacing: {
        variation: "3px",
      },
      
      // 断点（覆盖默认）
      screens: {
        sm: "320px",
        md: "800px",
        lg: "1280px",
      },
      
      // 列数（用于 Masonry 布局）
      columns: {
        "1": "1",
        "3": "3",
        "5": "5",
      },
      
      // 透明度
      opacity: {
        "2": "0.02",
        "6": "0.06",
        "20": "0.2",
        "60": "0.6",
        "70": "0.7",
        "95": "0.95",
      },
      
      // Z-index
      zIndex: {
        "1": "1",
        "2": "2",
        "3": "3",
        "20": "20",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
