import { Link, useNavigate } from 'react-router-dom';
import Button from '../form/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { createUserRepository } from '../../database/repositories';
import { Moon, Sun, UserCircle } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

export default function Navbar() {
  const { isAuthenticated, isAdmin, sessionUser, clearSession } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const userRepository = createUserRepository();
  const navigate = useNavigate();

  const nombre = sessionUser?.profile?.username || 'Usuario';
  const avatar = sessionUser?.profile?.avatar_url;
  const logoPath = theme === 'dark' ? '/assets/LogoModoOscuro.svg' : '/assets/LogoModoClaro.svg';

  const handleLogout = async () => {
    const { error } = await userRepository.logout();
    if (!error) {
      clearSession();
      navigate('/');
    }
  };

  return (
    <nav className="app-navbar border-b px-4 py-4 backdrop-blur md:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <img src={logoPath} alt="Logo StoryPlay" className="h-15 w-15 object-contain" />
          <span>StoryPlay</span>
        </Link>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          {isAuthenticated ? (
            <>
              <div className="app-chip flex items-center gap-2 rounded-full border px-3 py-2 shadow-sm">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="h-8 w-8 rounded-full border border-primary-300 object-cover" />
                ) : (
                  <UserCircle size={24} />
                )}
                <span className="text-sm font-medium">Hola, {nombre}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                {!isAdmin && <Link to="/products" className="transition hover:text-primary-600">Colección</Link>}
                <Link to="/perfil" className="transition hover:text-primary-600">Perfil</Link>
                {isAdmin && <Link to="/vistaAdmin" className="transition hover:text-primary-600">Administrador</Link>}
                {isAdmin && <Link to="/estadisticas" className="transition hover:text-primary-600">Estadísticas</Link>}
              </div>

              <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={handleLogout}>Cerrar sesión</Button>
                <button
                  onClick={toggleTheme}
                  className="app-secondary rounded-full border p-2 transition hover:border-primary-500 hover:text-primary-600"
                  title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
                >
                  {theme === 'light' ? <Moon size={20} strokeWidth={2} /> : <Sun size={20} strokeWidth={2} />}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 self-start md:self-auto">
              <Link to="/iniciarSesion"><Button variant="secondary">Iniciar sesión</Button></Link>
              <Link to="/registro"><Button>Crear cuenta</Button></Link>
              <button
                onClick={toggleTheme}
                className="app-secondary rounded-full border p-2 transition hover:border-primary-500 hover:text-primary-600"
                title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
              >
                {theme === 'light' ? <Moon size={20} strokeWidth={2} /> : <Sun size={20} strokeWidth={2} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
