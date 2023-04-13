import axios from "axios";

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

export const fetchGists = async (username: string): Promise<Gist[]> => {
  const { data } = await api.get(`/users/${username}/gists`);

  const processedGists = await Promise.all(
    data.map(async ({ description, files, forks_url, html_url, id }: Gist) => {
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
    })
  );

  return processedGists;
};
