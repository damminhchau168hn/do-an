import { Navigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { ROLE_LABELS } from '../../context/roles';

export default function RoleGuard({ allow, children }) {
  const { user, role } = useRole();

  if (!user) return <Navigate to="/login" replace />;

  if (!allow.includes(role)) {
    return (
      <div className="page-container">
        <div className="card">
          <div className="state-block error">
            Tài khoản của bạn có vai trò “{ROLE_LABELS[role] ?? role}” nên không có quyền vào trang này.
          </div>
        </div>
      </div>
    );
  }
  return children;
}