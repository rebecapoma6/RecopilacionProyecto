import { useThemeStore } from '../../store/useThemeStore';

export default function Footer() {
  const theme = useThemeStore((state) => state.theme);
  const logoPath = theme === 'dark' ? '/assets/LogoModoOscuro.svg' : '/assets/LogoModoClaro.svg';

  return (
    <footer className="app-footer mt-auto border-t px-4 py-6 font-sf-pro backdrop-blur md:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-2 text-center">
        <div className="flex items-center gap-2 text-lg-subtitle font-bold">
          <img src={logoPath} alt="Logo StoryPlay" className="h-7 w-8 object-contain" />
          <span>StoryPlay</span>
        </div>
        <p className="app-muted text-sm md:text-base-body">
          © 2026 StoryPlay. Tu biblioteca personal en la nube.
        </p>
      </div>
    </footer>
  );
}
