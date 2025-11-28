interface ImportMetaEnv {
  readonly BASE_URL: string;
  // добавь другие переменные если нужно
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}