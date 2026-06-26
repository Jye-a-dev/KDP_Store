export const AppRoutes = {
  // Auth
  onboarding: 'Onboarding',
  login: 'Login',
  register: 'Register',

  // Main tabs
  tabHome: 'TabHome',
  tabSearch: 'TabSearch',
  tabCart: 'TabCart',
  tabProfile: 'TabProfile',

  // Stacks inside tabs
  dashboard: 'Dashboard',
  productDetail: 'ProductDetail',
  home: 'Home',

  // Profile stack
  profile: 'Profile',
  orders: 'Orders',
  shippingAddress: 'ProfileShippingAddress',

  // Search
  search: 'Search',

  // Cart
  cart: 'Cart',
} as const;

export type AppRoute = typeof AppRoutes[keyof typeof AppRoutes];

