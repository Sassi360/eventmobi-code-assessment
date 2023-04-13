import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  ListItem,
  Spinner,
  Text,
  Tooltip,
  UnorderedList,
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
  forks: Array<{
    id: string;
    owner: { login: string; avatar_url: string; html_url: string };
  }>;
  fileTypes: JSX.Element[];
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

      console.log(data);

      const processedGists = data.map(
        ({ id, description, html_url, files, forks }: Gist) => ({
          id,
          description,
          html_url,
          fileTypes: Object.keys(files)?.map((filename) => (
            <Badge key={`${id}-${filename}`} size="xl">
              {files[filename]?.language}
            </Badge>
          )),
          forks,
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
        <UnorderedList>
          {gists.map(({ id, description, html_url, fileTypes, forks }) => (
            <ListItem key={id} gap="2" mb="6">
              <Link
                fontSize="lg"
                fontWeight="bold"
                href={html_url}
                textTransform="capitalize"
              >
                {description || "Unnamed Gist"}
              </Link>

              <Flex align="center" gap="3">
                <Text fontWeight="medium" fontSize="sm">
                  Filetype:
                </Text>
                {fileTypes?.length ? fileTypes : null}
              </Flex>

              <AvatarGroup>
                {forks
                  ?.slice(0, 3)
                  ?.map(({ id, owner: { login, avatar_url } }) => (
                    <Tooltip key={id} title={login}>
                      <Avatar src={avatar_url} />
                    </Tooltip>
                  ))}
              </AvatarGroup>
            </ListItem>
          ))}
        </UnorderedList>
      )}
    </Container>
  );
};
