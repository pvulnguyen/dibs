declare global {
  interface Window {
    ENV: {
      BASE_URL: string;
      SUPABASE_URL: string;
      SUPABASE_KEY: string;
    };
  }
}

export {};
