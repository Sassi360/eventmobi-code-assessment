import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Spinner,
  Text,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import "./App.css";

interface Gist {
  id: string;
  description?: string;
  html_url: string;
  files: Record<string, { language: string }>;
  fileTypes: string[];
  forks_url: string;
  owner: {
    login?: string;
    avatar_url?: string;
    html_url?: string;
  };
  forkedUsers: {
    avatar_url: string;
    html_url: string;
    login: string;
  }[];
}

const api = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github.v3+json",
  },
});

export const App: FC = () => {
  const [username, setUsername] = useState("");
  const [gists, setGists] = useState<Gist[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value);
    },
    []
  );

  const fetchGists = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/users/${username}/gists`);

      const processedGists = await Promise.all(
        data.map(async ({ id, description, html_url, files, forks_url }) => {
          const { data: forksData } = await api.get(forks_url);

          if (!forksData) {
            throw new Error("Forks data not available");
          }

          const forkedUsers = forksData
            .slice(-3)
            .map(({ owner: { login, avatar_url, html_url } }) => ({
              avatar_url,
              html_url,
              login,
            }));

          const fileTypes = Object.keys(files).map(
            (filename) => files[filename]?.language || "Unknown"
          );

          return {
            id,
            description,
            html_url,
            fileTypes,
            forkedUsers,
          };
        })
      );

      setGists(processedGists);
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred while fetching gists.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [username, toast]);

  const isEmpty = useMemo(() => gists.length === 0, [gists]);

  return (
    <Container maxW="container.xl" mx="auto" my="4">
      <Heading textAlign="center">Gist Explorer</Heading>
      <FormControl gap="10" mb="6">
        <FormLabel htmlFor="username">Enter a GitHub username:</FormLabel>
        <Input
          type="text"
          id="username"
          value={username}
          onChange={handleInputChange}
        />
      </FormControl>

      <Button
        colorScheme="twitter"
        type="submit"
        onClick={fetchGists}
        isLoading={isLoading}
        mb="6"
      >
        Fetch Gists
      </Button>

      {isLoading && (
        <Center>
          <Spinner />
        </Center>
      )}

      {isEmpty && !isLoading && (
        <Text fontSize="xl" fontWeight="bold" my="10" textAlign="center">
          No Gists found
        </Text>
      )}

      {!isEmpty && (
        <>
          {gists.map(({ id, description, html_url, fileTypes, forkedUsers }) => (
            <Card p="4" mb="6" key={id}>
              <Box gap="2">
                <Link
                  fontSize="lg"
                  fontWeight="bold"
                  href={html_url}
                  isExternal
                  textTransform="capitalize"
                >
                  {description || "Unnamed Gist"}
                </Link>

                <Box mt="2">
                  <Text fontWeight="medium" fontSize="sm">
                    Fork Users:
                  </Text>
                  <AvatarGroup size="xs" spacing={0.5}>
                    {forkedUsers.map(({ avatar_url, html_url, login }) => (
                      <Link href={html_url} key={login} isExternal >
                        <Avatar size="xs" name={login} src={avatar_url} />{" "}
                      </Link>
                    ))}
                  </AvatarGroup>
                </Box>
              </Box>

              <Flex align="center" gap="2" mt="3">
                <Text fontWeight="medium" fontSize="sm">
                  Filetype:
                </Text>
                {fileTypes.length > 0 ? (
                  fileTypes.map((type) => (
                    <Badge key={`${id}-${type}`}>{type}</Badge>
                  ))
                ) : (
                  <Text>Unknown</Text>
                )}
              </Flex>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
};
