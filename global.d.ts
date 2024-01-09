declare global {
  interface Window {
    ENV: {
      BASE_URL: string;
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
    };
  }
}

export {};
