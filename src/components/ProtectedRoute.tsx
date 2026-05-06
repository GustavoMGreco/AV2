import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NivelPermissao } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permissoes?: NivelPermissao[];
}

export default function ProtectedRoute({ children, permissoes }: ProtectedRouteProps) {
  const { isAuthenticated, temPermissao } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (permissoes && !temPermissao(permissoes)) {
    return (
      <div className="access-denied">
        <div className="access-denied-icon"></div>
        <h2>Acesso Negado</h2>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return <>{children}</>;
}
