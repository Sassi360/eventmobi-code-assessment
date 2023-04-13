import {
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { IconAlertTriangleFilled, IconX } from "@tabler/icons-react";
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { useAsync, useDebounce } from "react-use";
import { fetchGists } from "./api";
import { GistCard } from "./components/GistCard";


export const App: FC = () => {
  const [username, setUsername] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [isClear, setIsClear] = useState(true);

  useDebounce(
    () => {
      setDebouncedUsername(username);
    },
    500,
    [username]
  );

  const toast = useToast();

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setUsername(value);
      setIsClear(value === "");
    },
    []
  );

  const handleClearClick = useCallback(() => {
    setUsername("");
    setIsClear(true);
  }, []);

  const {
    loading,
    error,
    value: gists = [],
  } = useAsync(async () => {
    if (!debouncedUsername) return [];

    const processedGists = await fetchGists(debouncedUsername);

    return processedGists;
  }, [debouncedUsername]);

  useEffect(() => {
    if (error) {
      console.error(error);
      toast({
        duration: 5000,
        isClosable: true,
        status: "error",
        title: "The username you entered does not exist",
      });
    }
  }, [error, toast]);

  return (
    <Container maxW="container.xl" mx="auto" my="4">
      <Heading textAlign="center">Gist Explorer</Heading>
      <FormControl gap="10" mb="4">
        <FormLabel htmlFor="username">Enter a GitHub username:</FormLabel>
        <InputGroup>
          <Input
            id="username"
            onChange={handleInputChange}
            type="text"
            value={username}
            variant="filled"
          />

          <InputRightElement>
            {!isClear && (
              <Icon as={IconX} onClick={handleClearClick} cursor="pointer" />
            )}
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="twitter"
        disabled={!username || loading}
        isLoading={loading}
        loadingText="Loading"
        mb="10"
        type="submit"
        onClick={handleClearClick}
      >
        {loading ? "Fetching Gists..." : "Fetch Gists"}
      </Button>

      {loading && (
        <Center>
          <Spinner />
        </Center>
      )}
      {error && (
        <Center>
          <Icon as={IconAlertTriangleFilled} fontSize="9xl" />
        </Center>
      )}

      <SimpleGrid columns={[1, 2, 3]} spacing="5">
        {gists.map((gist) => (
          <GistCard key={gist.id} {...gist} />
        ))}
      </SimpleGrid>
    </Container>
  );
};
