import { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut, User, Settings, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useRole } from '../../hooks';

const UserProfileDropdown = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { role } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  const handleNavigate = (route) => {
    setIsOpen(false);
    if (route) {
      navigate(route);
    }
  };

  // Generate avatar initials
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const initials = getInitials(user?.name);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all duration-200 ease-out group"
      >
        {/* Avatar Circle */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm group-hover:shadow-md transition-shadow duration-200">
            {initials}
          </div>
          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
        </div>

        {/* Username and Arrow */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-900 leading-tight">
              {user?.name?.split(' ')[0]}
            </div>
            <div className="text-xs text-slate-500 capitalize">
              {role}
            </div>
          </div>
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform duration-200 ease-out ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <div className="text-sm font-semibold text-slate-900">{user?.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">{user?.email}</div>
            <div className="inline-block mt-2 px-2 py-1 bg-blue-100 rounded-md">
              <span className="text-xs font-medium text-blue-700 capitalize">{role}</span>
            </div>
          </div>

          {/* Menu Items */}
         

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 ease-out group"
          >
            <LogOut
              size={18}
              className="text-red-400 group-hover:text-red-600 transition-colors duration-150"
            />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
