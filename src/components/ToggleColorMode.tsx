import { Button, Icon, useColorMode } from "@chakra-ui/react";
import { IconBrightness2, IconMoonFilled } from "@tabler/icons-react";
import { FC } from "react";

export const ToggleColorMode: FC = ({}) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button onClick={toggleColorMode} pos="absolute" right="4">
      <Icon as={colorMode === "light" ? IconMoonFilled : IconBrightness2} fontSize="xl" />
    </Button>
  );
};
