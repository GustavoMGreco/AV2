import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type Funcionario, NivelPermissao } from '../types';

interface AuthContextType {
  usuario: Funcionario | null;
  isAuthenticated: boolean;
  login: (username: string, senha: string, funcionarios: Funcionario[]) => boolean;
  logout: () => void;
  temPermissao: (niveis: NivelPermissao[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Funcionario | null>(null);

  const login = useCallback((username: string, senha: string, funcionarios: Funcionario[]): boolean => {
    const found = funcionarios.find(
      (f) => f.usuario === username && f.senha === senha
    );
    if (found) {
      setUsuario(found);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
  }, []);

  const temPermissao = useCallback(
    (niveis: NivelPermissao[]): boolean => {
      if (!usuario) return false;
      return niveis.includes(usuario.nivelPermissao);
    },
    [usuario]
  );

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAuthenticated: !!usuario,
        login,
        logout,
        temPermissao,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
