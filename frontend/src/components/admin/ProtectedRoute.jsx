import { Navigate, Outlet } from 'react-router-dom';
import { isAuthed } from '../../api/auth';

export default function ProtectedRoute() {
  if (!isAuthed()) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
