export const AppRoutes = {
  home: 'Home',
  onboarding: 'Onboarding',
  login: 'Login',
  register: 'Register',
  dashboard: 'Dashboard',
} as const;

export type AppRoute = typeof AppRoutes[keyof typeof AppRoutes];
