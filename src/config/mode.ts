/**
 * App Mode Configuration
 * - mock: All API calls return mock data (Demo/Web use)
 * - dev: Real API calls with debug logging enabled
 * - prod: Real API calls, strict validation, no debug info
 */

export type AppMode = 'mock' | 'dev' | 'prod';

const getMode = (): AppMode => {
  const env = import.meta.env.VITE_APP_MODE as AppMode;
  if (env === 'dev' || env === 'prod') return env;
  return 'mock'; // Default to mock for demo
};

export const APP_MODE: AppMode = getMode();

export const isMock = () => APP_MODE === 'mock';
export const isDev = () => APP_MODE === 'dev';
export const isProd = () => APP_MODE === 'prod';

export const config = {
  mode: APP_MODE,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.mintledger.app',
  mockDelay: 600, // ms, simulates network latency in mock mode
  debug: APP_MODE !== 'prod',
};
