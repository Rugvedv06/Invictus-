import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout';
import { PrivateRoute, RoleBasedRoute } from './routes';
import LandingPage from './features/landing/LandingPage';
import Login from './features/auth/Login';
import Dashboard from './features/dashboard/Dashboard';
import Inventory from './features/inventory/Inventory';
import Employees from './features/employees/Employees';
import PCBManagement from './features/pcb/PCBManagement';
import PCBProductionEntry from './features/pcb/PCBProductionEntry';
import AnalyticsDashboard from './features/analytics/AnalyticsDashboard';
import ExcelImportExport from './features/analytics/ExcelImportExport';
import { ROUTES, ROLES } from './constants';

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<LandingPage />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />

      <Route
        path={ROUTES.DASHBOARD}
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.INVENTORY}
        element={
          <PrivateRoute>
            <Layout>
              <Inventory />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.EMPLOYEES}
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
              <Layout>
                <Employees />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.PCB_MANAGEMENT}
        element={
          <PrivateRoute>
            <Layout>
              <PCBManagement />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.PCB_PRODUCTION}
        element={
          <PrivateRoute>
            <Layout>
              <PCBProductionEntry />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.ANALYTICS}
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
              <Layout>
                <AnalyticsDashboard />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.IMPORT_EXPORT}
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
              <Layout>
                <ExcelImportExport />
              </Layout>
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}

export default App;
