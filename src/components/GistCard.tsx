import {
    Avatar,
    Badge,
    Box,
    Card,
    CardBody,
    CardHeader,
    Link,
    Text,
} from "@chakra-ui/react";
import { FC, memo } from "react";

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

export const GistCard: FC<Gist> = memo(
  ({ id, description = "Unnamed Gist", html_url, fileTypes, forkedUsers }) => (
    <Card mb="6" variant="outline" shadow="md">
      <CardHeader>
        <Link href={html_url} isExternal>
          <Text fontSize="md" fontWeight="medium" noOfLines={2}>
            {description ? description : "**Missing Description**"}
          </Text>
        </Link>
      </CardHeader>
      <CardBody pt="0">
        <Box mt="3">
          <Text fontSize="sm" fontWeight="medium">
            Filetype:
          </Text>
          {fileTypes.length > 0 &&
            fileTypes.map((type) => (
              <Badge key={`${id}-${type}`}>{type}</Badge>
            ))}
        </Box>

        <Box mt="2">
          <Text fontSize="sm" fontWeight="medium">
            Fork Users:
          </Text>
          {forkedUsers.length > 0 ? (
            forkedUsers.map(({ avatar_url, html_url, login }) => (
              <Link href={html_url} key={login} isExternal>
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
