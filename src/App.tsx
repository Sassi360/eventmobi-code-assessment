import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import {
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDebounce } from "react-use";
import "./App.css";

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

// Memoize functional components and avoid unnecessary re-renders. This is especially useful when dealing with large lists.
const GistCard: FC<Gist> = memo(
  ({ id, description, html_url, fileTypes, forkedUsers }) => (
    <Card mb="6" key={id} variant="outline" shadow="md">
      <CardHeader>
        <Link href={html_url} isExternal>
          <Heading size="md">{description || "Unnamed Gist"}</Heading>
        </Link>
      </CardHeader>
      <CardBody pt="0">
        <Flex align="center" gap="2" mt="3" flexWrap="wrap">
          <Text fontWeight="medium" fontSize="sm">
            Filetype:
          </Text>
          {fileTypes.length > 0 &&
            fileTypes.map((type) => (
              <Badge key={`${id}-${type}`}>{type}</Badge>
            ))}
        </Flex>

        <Box mt="2">
          <Text fontWeight="medium">Fork Users:</Text>
          {forkedUsers.length > 0
            ? forkedUsers.map(({ avatar_url, html_url, login }) => (
                <Link href={html_url} key={login} isExternal>
                  <Avatar size="sm" name={login} src={avatar_url} />
                </Link>
              ))
            : "None"}
        </Box>
      </CardBody>
    </Card>
  )
);

export const App: FC = () => {
  const [gists, setGists] = useState<Gist[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");

  // Added debounce hook to prevent user from spamming the API request too frequently
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
      setUsername(event.target.value);
    },
    []
  );

  /*
   Instead of calling the fetchGists function on button click, we can use the useEffect hook to fetch the data when the
    component mounts or when the username state changes. This will make the code more efficient and easier to read.
  */
  useEffect(() => {
    const fetchGists = async () => {
      try {
        setIsLoading(true);
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

              const fileTypes = Object.keys(files).map(
                (filename) => files[filename]?.language || "Unknown"
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

        setGists(processedGists);
      } catch (error) {
        console.error(error);
        toast({
          duration: 5000,
          isClosable: true,
          status: "error",
          title: "The username you entered does not exist",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (debouncedUsername) {
      fetchGists();
    }
  }, [debouncedUsername, toast]);

  const isEmpty = useMemo(() => gists.length === 0, [gists]);

  return (
    <Container maxW="container.xl" mx="auto" my="4">
      <Heading textAlign="center">Gist Explorer</Heading>
      <FormControl gap="10" mb="4">
        <FormLabel htmlFor="username">Enter a GitHub username:</FormLabel>
        <Input
          id="username"
          onChange={handleInputChange}
          type="text"
          value={username}
          variant="filled"

        />
      </FormControl>
      <Button
        colorScheme="twitter"
        disabled={!username || isLoading}
        isLoading={isLoading}
        mb="10"
        type="submit"
      >
        {isLoading ? "Fetching Gists..." : "Fetch Gists"}
      </Button>

      {isEmpty && !isLoading && (
        <Text fontSize="xl" fontWeight="bold" my="10" textAlign="center">
          No Gists found
        </Text>
      )}

      {!isEmpty && isLoading ? (
        <div>Loading...</div>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing="5">
          {gists.map((gist) => (
            <GistCard key={gist.id} {...gist} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
};
