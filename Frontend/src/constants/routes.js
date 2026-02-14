export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',

  // Inventory Management
  INVENTORY: '/inventory',

  // PCB Management
  PCB_MANAGEMENT: '/pcbs',
  PCB_PRODUCTION: '/pcb-production',
  PCB_DETAILS: '/pcbs/:id',

  // Analytics
  ANALYTICS: '/analytics',

  // Import/Export
  IMPORT_EXPORT: '/import-export',

  // Procurement
  PROCUREMENT: '/procurement',

  // Employees (existing)
  EMPLOYEES: '/employees',

  NOT_FOUND: '*',
};

export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'dashboard',
  },
  {
    label: 'Component Inventory',
    path: ROUTES.INVENTORY,
    icon: 'inventory',
  },
  {
    label: 'PCB Management',
    path: ROUTES.PCB_MANAGEMENT,
    icon: 'developer_board',
  },
  {
    label: 'PCB Production',
    path: ROUTES.PCB_PRODUCTION,
    icon: 'precision_manufacturing',
  },
  {
    label: 'Analytics',
    path: ROUTES.ANALYTICS,
    icon: 'analytics',
  },
  {
    label: 'Import/Export',
    path: ROUTES.IMPORT_EXPORT,
    icon: 'import_export',
  },
  {
    label: 'Procurement',
    path: ROUTES.PROCUREMENT,
    icon: 'local_shipping',
  },
];
