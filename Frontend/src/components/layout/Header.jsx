import { LogOut, User, LayoutDashboard, Package, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth, useRole } from '../../hooks';
import { APP_CONFIG, ROUTES } from '../../constants';

const Header = () => {
  const { user, logout } = useAuth();
  const { role, isAdmin } = useRole();

  return (
    <header className="bg-white border-b border-secondary-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <h1 className="text-2xl font-bold text-primary">
              {APP_CONFIG.APP_NAME}
            </h1>

            <nav className="hidden md:flex items-center gap-6">
              <NavLink
                to={ROUTES.DASHBOARD}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-secondary-600 hover:text-primary'
                  }`
                }
              >
                <LayoutDashboard size={18} />
                Dashboard
              </NavLink>
              <NavLink
                to={ROUTES.INVENTORY}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-secondary-600 hover:text-primary'
                  }`
                }
              >
                <Package size={18} />
                Inventory
              </NavLink>
              {isAdmin && (
                <NavLink
                  to={ROUTES.EMPLOYEES}
                  className={({ isActive }) =>
                    `flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-secondary-600 hover:text-primary'
                    }`
                  }
                >
                  <Users size={18} />
                  Employees
                </NavLink>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary-50 rounded-lg">
              <User size={20} className="text-secondary-600" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-secondary-900">
                  {user?.name}
                </span>
                <span className="text-xs text-secondary-500 capitalize">
                  {role}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
