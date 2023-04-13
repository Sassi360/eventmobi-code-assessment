/// <reference types="vite/client" />
interface Envs {
  readonly PERSONAL_ACCESS_TOKEN: string;
  NODE_ENV: "development" | "staging" | "production";
}

interface ImportMetaEnv extends Envs {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}