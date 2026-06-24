export const AppRoutes = {
  home: 'Home',
  login: 'Login',
  dashboard: 'Dashboard',
} as const;

export type AppRoute = typeof AppRoutes[keyof typeof AppRoutes];
