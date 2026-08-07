import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Guard dashboard: wajib login; opsional pembatasan role tertentu
export default function ProtectedRoute({ roles }) {
  const { admin } = useAuth();
  const token = localStorage.getItem('kwau_token');
  if (!token || !admin) return <Navigate to="/admin/login" replace />;
  if (roles && admin.role !== 'superadmin' && !roles.includes(admin.role)) {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
}
