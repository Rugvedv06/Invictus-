import { useSelector } from 'react-redux';
import { ROLES, ROLE_PERMISSIONS } from '../constants';

export const useRole = () => {
  const { user } = useSelector((state) => state.auth);

  const isAdmin = user?.role === ROLES.ADMIN || user?.role === 'admin' || user?.role === 'Admin';
  const isEmployee = user?.role === ROLES.EMPLOYEE || user?.role === 'employee' || user?.role === 'Employee';

  const hasPermission = (permission) => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  };

  return {
    isAdmin,
    isEmployee,
    role: user?.role,
    hasPermission,
  };
};
