import {
  Center,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  SimpleGrid,
  Spinner,
  Text,
  useToast
} from "@chakra-ui/react";
import { IconAlertTriangleFilled, IconX } from "@tabler/icons-react";
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { useAsync, useDebounce } from "react-use";
import { fetchGists } from "./api";
import { GistCard, GistProps } from "./components/GistCard";

const LoadingSpinner: FC = () => (
  <Center>
    <Spinner />
  </Center>
);

const ErrorIcon: FC = () => (
  <Center>
    <Icon as={IconAlertTriangleFilled} fontSize="9xl" />
  </Center>
);

export const App: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [debouncedUsername, setDebouncedUsername] = useState<string>("");
  const [isClear, setIsClear] = useState<boolean>(true);

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
    value: gists = [] as GistProps[],
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
    <Container maxW="container.xl" mx="auto" my="10">
      <Heading textAlign="center" mb="6">
        Gist Explorer
      </Heading>
      <FormControl gap="10" mb="10">
        <FormLabel htmlFor="username">Username for Public Gists</FormLabel>
        <InputGroup>
          <Input
            id="username"
            onChange={handleInputChange}
            type="text"
            value={username}
            variant="filled"
          />
          {!isClear && (
            <InputRightAddon>
              <Flex
                align="center"
                gap="1"
                cursor="pointer"
                onClick={handleClearClick}
              >
                <Icon as={IconX} />
                Clear
              </Flex>
            </InputRightAddon>
          )}
        </InputGroup>
      </FormControl>

      {loading && <LoadingSpinner />}

      {error && <ErrorIcon />}

      {!loading && !error && gists.length > 0 && (
        <>
          {username && (
            <Heading textTransform="capitalize" mb="3">
              {username} Public Gists
            </Heading>
          )}
          <Divider mb="5" />
          <SimpleGrid columns={[1, 2, 3]} spacing="5">
            {gists.map((gist: GistProps) => (
              <GistCard key={gist.id} {...gist} />
            ))}
          </SimpleGrid>
        </>
      )}

      {!loading && !error && gists.length === 0 && username && (
        <Flex justify="center" align="center" minH="full">
          <Text fontSize="lg">
            No public Gists found for the username "{username}". Please try a
            different username.
          </Text>
        </Flex>
      )}
    </Container>
  );
};
