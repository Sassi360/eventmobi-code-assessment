import {
  Avatar,
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Link,
  Text,
} from "@chakra-ui/react";
import { IconBrandGithubFilled } from "@tabler/icons-react";
import { FC, memo } from "react";

interface GistFile {
  language: string;
}

interface ForkedUser {
  avatar_url: string;
  html_url: string;
  login: string;
}

interface GistProps {
  description?: string;
  files: Record<string, GistFile>;
  fileTypes: string[];
  forks_url: string;
  forkedUsers: ForkedUser[];
  html_url: string;
  id: string;
  owner: {
    login?: string;
    avatar_url?: string;
    html_url?: string;
  };
}

export const GistCard: FC<GistProps> = memo(
  ({ id, description = "Unnamed Gist", html_url, fileTypes, forkedUsers }) => (
    <Card mb="6" variant="outline" shadow="md">
      {/* Description */}
      <CardHeader pb="0">
        <Link
          href={html_url}
          isExternal
          display="flex"
          flexDirection="row"
          gap="2"
          alignContent="center"
        >
          <Icon as={IconBrandGithubFilled} fontSize="xl" />
          <Text
            fontSize="md"
            fontWeight="medium"
            noOfLines={2}
            textTransform="capitalize"
          >
            {description ? description : "**Missing Description**"}
          </Text>
        </Link>
      </CardHeader>

      {/* Filetype Badge */}
      <CardBody pt="0">
        <Box mt="3">
          <Text fontSize="sm" fontWeight="medium">
            Filetype:
          </Text>
          {fileTypes.length > 0 &&
            fileTypes.map((type) => (
              <Badge key={`${type}-${id}-${Math.random().toString(36)}`}>{type}</Badge>
            ))}
        </Box>

        {/* Fork Users */}
        <Box mt="2">
          <Text fontSize="sm" fontWeight="medium">
            Fork Users:
          </Text>
          {forkedUsers.length > 0 ? (
            forkedUsers.map(({ avatar_url, html_url, login }) => (
              <Link href={html_url} key={`${login}-${avatar_url}`} isExternal>
                <Avatar size="sm" name={login} src={avatar_url} />
              </Link>
            ))
          ) : (
            <Text fontSize="sm">None</Text>
          )}
        </Box>
      </CardBody>
    </Card>
  )
);
