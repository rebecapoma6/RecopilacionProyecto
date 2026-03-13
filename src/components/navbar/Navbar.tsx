import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, UserCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createUserRepository } from '../../database/repositories';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { LanguageSwitcher } from './LanguageSwitcher';
import Button from '../form/Button';

export default function Navbar() {
  const { t } = useTranslation();
  const { isAuthenticated, isAdmin, sessionUser, clearSession } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const userRepository = createUserRepository();
  const navigate = useNavigate();

  const nombre = sessionUser?.profile?.username || t('navbar.userFallback');
  const avatar = sessionUser?.profile?.avatar_url;
  const logoPath = theme === 'dark' ? '/assets/LogoModoOscuro.svg' : '/assets/LogoModoClaro.svg';
  const tituloTema = theme === 'light' ? t('navbar.themeToDark') : t('navbar.themeToLight');

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
          <img src={logoPath} alt={t('navbar.logoAlt')} className="h-15 w-15 object-contain" />
          {t('common.brand')}
        </Link>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          {isAuthenticated ? (
            <>
              <div className="app-chip flex items-center gap-2 rounded-full border px-3 py-2">
                {avatar ? (
                  <img src={avatar} alt={t('navbar.avatarAlt', { user: nombre })} className="h-8 w-8 rounded-full border border-primary-300 object-cover" />
                ) : (
                  <UserCircle size={24} />
                )}
                <span className="text-sm font-medium">{t('navbar.greeting', { user: nombre })}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                {!isAdmin && <Link to="/products" className="transition hover:text-primary-600">{t('navbar.collection')}</Link>}
                <Link to="/perfil" className="transition hover:text-primary-600">{t('navbar.profile')}</Link>
                {isAdmin && <Link to="/vistaAdmin" className="transition hover:text-primary-600">{t('navbar.admin')}</Link>}
                {isAdmin && <Link to="/estadisticas" className="transition hover:text-primary-600">{t('navbar.stats')}</Link>}
              </div>

              <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={handleLogout}>{t('navbar.logout')}</Button>
                <button
                  onClick={toggleTheme}
                  className="app-secondary rounded-full border p-2"
                  title={tituloTema}
                  aria-label={tituloTema}
                >
                  {theme === 'light' ? <Moon size={20} strokeWidth={2} /> : <Sun size={20} strokeWidth={2} />}
                </button>
                <LanguageSwitcher></LanguageSwitcher>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 self-start md:self-auto">
              <Link to="/iniciarSesion"><Button variant="secondary">{t('navbar.login')}</Button></Link>
              <Link to="/registro"><Button>{t('navbar.createAccount')}</Button></Link>
              <button
                onClick={toggleTheme}
                className="app-secondary rounded-full border p-2"
                title={tituloTema}
                aria-label={tituloTema}
              >
                {theme === 'light' ? <Moon size={20} strokeWidth={2} /> : <Sun size={20} strokeWidth={2} />}
              </button>

              <LanguageSwitcher></LanguageSwitcher>
            </div>

          )}
        </div>
      </div>
    </nav>
  );
}

