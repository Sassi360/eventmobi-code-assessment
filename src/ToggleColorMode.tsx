import { Button, useColorMode } from "@chakra-ui/react";
import { FC } from "react";

export const ToggleColorMode: FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button onClick={toggleColorMode} pos="absolute" right="4" top="2">
      Toggle {colorMode === "light" ? "Dark" : "Light"}
    </Button>
  );
};
