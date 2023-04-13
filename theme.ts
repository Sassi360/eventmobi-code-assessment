import { extendTheme } from "@chakra-ui/react";

declare global {
  var colorMode: "dark" | "light";
}

export const theme = extendTheme({
  config: {
    initialColorMode: globalThis.colorMode,
    useSystemColorMode: true,
    disableTransitionOnChange: false,
  },
});
