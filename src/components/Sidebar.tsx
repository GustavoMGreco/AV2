import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NivelPermissao } from '../types';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  permissoes: NivelPermissao[];
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', path: '/', icon: '', permissoes: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR] },
  { label: 'Cadastrar Aeronave', path: '/aeronaves/nova', icon: '', permissoes: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO] },
  { label: 'Gerenciar Funcionários', path: '/funcionarios/novo', icon: '', permissoes: [NivelPermissao.ADMINISTRADOR] },
  { label: 'Gerenciar Etapas', path: '/etapas', icon: '', permissoes: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR] },
  { label: 'Gerenciar Peças', path: '/pecas', icon: '', permissoes: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR] },
  { label: 'Alocar Equipe', path: '/alocacao', icon: '', permissoes: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO] },
  { label: 'Testes de Qualidade', path: '/testes', icon: '', permissoes: [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO] },
  { label: 'Relatório Final', path: '/relatorios', icon: '', permissoes: [NivelPermissao.ADMINISTRADOR] },
];

export default function Sidebar() {
  const { usuario, logout, temPermissao } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filtered = menuItems.filter((item) => temPermissao(item.permissoes));

  return (
    <>
      {/* Mobile top bar */}
      <header className="mobile-topbar">
        <button className="hamburger-btn" onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
          <span /><span /><span />
        </button>
        <span className="mobile-topbar-title">AEROCODE</span>
        <div style={{ width: 40 }} />
      </header>

      {/* Overlay backdrop */}
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar panel */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
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
    </>
  );
}
