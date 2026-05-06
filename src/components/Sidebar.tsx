import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NivelPermissao } from '../types';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  permissoes: NivelPermissao[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: '',
    permissoes: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR],
  },
  {
    label: 'Cadastrar Aeronave',
    path: '/aeronaves/nova',
    icon: '',
    permissoes: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO],
  },
  {
    label: 'Cadastrar Funcionário',
    path: '/funcionarios/novo',
    icon: '',
    permissoes: [NivelPermissao.ADMINISTRADOR],
  },
  {
    label: 'Gerenciar Etapas',
    path: '/etapas',
    icon: '',
    permissoes: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR],
  },
  {
    label: 'Gerenciar Peças',
    path: '/pecas',
    icon: '',
    permissoes: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR],
  },
  {
    label: 'Alocar Equipe',
    path: '/alocacao',
    icon: '',
    permissoes: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO],
  },
  {
    label: 'Testes de Qualidade',
    path: '/testes',
    icon: '',
    permissoes: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO],
  },
  {
    label: 'Relatório Final',
    path: '/relatorios',
    icon: '',
    permissoes: [NivelPermissao.ADMINISTRADOR],
  },
];

export default function Sidebar() {
  const { usuario, logout, temPermissao } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filtered = menuItems.filter((item) => temPermissao(item.permissoes));

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <span className="logo-icon"></span>
          <span className="logo-text">AEROCODE</span>
        </div>
        <span className="sidebar-subtitle">Aircraft Management</span>
      </div>

      <nav className="sidebar-nav">
        {filtered.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
            }
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span className="sidebar-link-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {usuario?.nome?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{usuario?.nome}</span>
            <span className="sidebar-user-role">{usuario?.nivelPermissao}</span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout} title="Sair">
          ⏻
        </button>
      </div>
    </aside>
  );
}
