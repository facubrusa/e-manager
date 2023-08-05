interface Config {
  env: string;
  backendUrl: string;
}

const config: Config = {
  env: import.meta.env.VITE_NODE_ENV || 'development',
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/v1',
};

export default config;
