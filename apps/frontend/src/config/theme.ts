import createCache from "@emotion/cache";
import { createTheme } from "@mui/material";
import { Kanit } from "@next/font/google";

export const kanit = Kanit({
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin", "thai"],
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#7B57D0",
      dark: "#4A2EB6",
      900: "#231CA0",
      800: "#3C28AE",
      700: "#4A2EB6",
      600: "#5836BF",
      500: "#623BC5",
      400: "#7B57D0",
      300: "#9475DB",
      200: "#B39DE6",
      100: "#D1C4EF",
      50: "#EDE7F9",
    },
    secondary: {
      main: "#DCED89",
      dark: "#699C17",
      900: "#2F6700",
      800: "#54890D",
      700: "#699C17",
      600: "#7EB021",
      500: "#8EC029",
      400: "#9EC94B",
      300: "#AFD36A",
      200: "#C5E091",
      100: "#DCEDB9",
      50: "#F1F8E3",
    },
    error: {
      main: "#B00020",
    },
  },
  typography: {
    fontFamily: kanit.style.fontFamily,
  },
});

export function createEmotionCache() {
  let insertionPoint;

  if (typeof document !== "undefined") {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]'
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({ key: "mui-style", insertionPoint });
}

export default theme;
