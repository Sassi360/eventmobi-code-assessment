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
  useToast
} from "@chakra-ui/react";
import { IconAlertTriangleFilled, IconX } from "@tabler/icons-react";
import axios from "axios";
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { useAsync, useDebounce } from "react-use";

import "./App.css";
import { GistCard } from "./components/GistCard";

interface Gist {
  description?: string;
  files: Record<string, { language: string }>;
  fileTypes: string[];
  forks_url: string;
  forkedUsers: {
    avatar_url: string;
    html_url: string;
    login: string;
  }[];
  html_url: string;
  id: string;
  owner: {
    login?: string;
    avatar_url?: string;
    html_url?: string;
  };
}

// Generate your github access token to increase your rate limit
const token = import.meta.env.VITE_ACCESS_TOKEN;

const api = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github.v3+json",
    Authorization: `Bearer ${token}`,
  },
});

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

    const { data } = await api.get(`/users/${debouncedUsername}/gists`);

    const processedGists = await Promise.all(
      data.map(
        async ({ description, files, forks_url, html_url, id }: Gist) => {
          const { data: forksData } = await api.get(forks_url);

          if (!forksData) {
            throw new Error("Forks data not available");
          }

          const forkedUsers = forksData
            .slice(-3)
            .map(({ owner: { avatar_url, html_url, login } }: Gist) => ({
              avatar_url,
              html_url,
              login,
            }));

          const fileTypes = Object.values(files).map(
            (file) => file?.language ?? "Unknown"
          );

          return {
            description,
            fileTypes,
            forkedUsers,
            html_url,
            id,
          };
        }
      )
    );

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
