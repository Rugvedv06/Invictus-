import { useMemo, useState } from 'react';
import {
  Bell,
  CheckCheck,
  FileSpreadsheet,
  Factory,
  LayoutDashboard,
  Package,
  Trash2,
  Users,
  Cpu,
  BarChart2,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth, useRole } from '../../hooks';
import { APP_CONFIG, ROUTES } from '../../constants';
import logo1 from '../../assets/logo1.png';
import {
  clearNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  requestBrowserPermission,
} from '../../features/notifications/notificationSlice';
import UserProfileDropdown from './UserProfileDropdown';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role, isAdmin } = useRole();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { items, unreadCount, permission } = useSelector((state) => state.notifications);

  const recentNotifications = useMemo(() => items.slice(0, 8), [items]);

  const handleOpenNotification = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  const handleNotificationClick = (entry) => {
    dispatch(markNotificationRead(entry.id));
    if (entry.route) {
      navigate(entry.route);
    }
    setIsNotificationOpen(false);
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  const handleEnableBrowserAlerts = () => {
    dispatch(requestBrowserPermission());
  };

  return (
    <header className="bg-white border-b border-secondary-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <img src={logo1} alt="InventoryX logo" className="h-12 w-12 rounded-lg object-contain" />
              <h1 className="text-2xl font-bold text-primary-700">
                {APP_CONFIG.APP_NAME}
              </h1>
            </div>

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
              <NavLink
                to={ROUTES.PCB_MANAGEMENT}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-secondary-600 hover:text-primary'
                  }`
                }
              >
                <Cpu size={18} />
                PCBs
              </NavLink>
              <NavLink
                to={ROUTES.PCB_PRODUCTION}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-secondary-600 hover:text-primary'
                  }`
                }
              >
                <Factory size={18} />
                Production
              </NavLink>
              {isAdmin && (
                <>
                  <NavLink
                    to={ROUTES.ANALYTICS}
                    className={({ isActive }) =>
                      `flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-secondary-600 hover:text-primary'
                      }`
                    }
                  >
                    <BarChart2 size={18} />
                    Analytics
                  </NavLink>
                  <NavLink
                    to={ROUTES.IMPORT_EXPORT}
                    className={({ isActive }) =>
                      `flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-secondary-600 hover:text-primary'
                      }`
                    }
                  >
                    <FileSpreadsheet size={18} />
                    Data
                  </NavLink>
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
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={handleOpenNotification}
                className="relative flex items-center justify-center h-11 w-11 text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-danger text-white rounded-full text-[11px] font-semibold flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white border border-secondary-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-secondary-200 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-secondary-900">Notifications</p>
                      <p className="text-xs text-secondary-600">{unreadCount} unread</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleMarkAllRead}
                        className="p-2 text-secondary-600 hover:text-primary hover:bg-secondary-50 rounded-md"
                        title="Mark all as read"
                      >
                        <CheckCheck size={16} />
                      </button>
                      <button
                        onClick={() => dispatch(clearNotifications())}
                        className="p-2 text-secondary-600 hover:text-danger hover:bg-secondary-50 rounded-md"
                        title="Clear all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {permission !== 'granted' && permission !== 'unsupported' && (
                    <div className="px-4 py-3 border-b border-secondary-200 bg-primary-50">
                      <p className="text-xs text-secondary-700 mb-2">
                        Enable browser notifications to get real-time alerts even when this tab is inactive.
                      </p>
                      <button
                        onClick={handleEnableBrowserAlerts}
                        className="text-xs font-medium px-3 py-1.5 rounded-md bg-primary-500 text-white hover:bg-primary-700"
                      >
                        Enable Browser Alerts
                      </button>
                    </div>
                  )}

                  <div className="max-h-96 overflow-y-auto">
                    {recentNotifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-secondary-600 text-sm">
                        No notifications yet.
                      </div>
                    ) : (
                      recentNotifications.map((entry) => (
                        <button
                          key={entry.id}
                          onClick={() => handleNotificationClick(entry)}
                          className={`w-full text-left px-4 py-3 border-b border-secondary-100 hover:bg-secondary-50 transition-colors ${
                            entry.isRead ? 'bg-white' : 'bg-primary-50/40'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-secondary-900">{entry.title}</p>
                              <p className="text-xs text-secondary-600 mt-1">{entry.message}</p>
                            </div>
                            {!entry.isRead && (
                              <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
