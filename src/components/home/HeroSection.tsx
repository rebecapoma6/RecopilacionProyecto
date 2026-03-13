import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import Button from '../form/Button';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const navegar = useNavigate();
  const { t } = useTranslation();
  const estaAutenticado = useAuthStore((state) => state.isAuthenticated);
  const tema = useThemeStore((state) => state.theme);

  const seccionRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const veloRef = useRef<HTMLDivElement | null>(null);
  const contenidoRef = useRef<HTMLDivElement | null>(null);

  const rutaLogo = tema === 'dark' ? '/assets/LogoModoOscuro.svg' : '/assets/LogoModoClaro.svg';
  const claseVelo = tema === 'dark' ? 'bg-slate-950/55' : 'bg-white/60';
  const claseLogo = tema === 'dark' ? 'bg-slate-900/75 border-white/10' : 'bg-white/85 border-white/40';
  const claseTarjeta = tema === 'dark' ? 'bg-slate-900/75 text-white' : 'bg-white/85 text-slate-900';
  const claseFondo = tema === 'dark' ? 'from-slate-950 to-slate-900' : 'from-sky-100 to-white';
  const claseSubtitulo = tema === 'dark' ? 'text-slate-300' : 'text-slate-600';

  useEffect(() => {
    const seccion = seccionRef.current;
    const hero = heroRef.current;
    const logo = logoRef.current;
    const velo = veloRef.current;
    const contenido = contenidoRef.current;
    const navbar = document.querySelector<HTMLElement>('[data-navbar-shell]');
    const logoNavbar = document.querySelector<HTMLElement>('[data-navbar-logo]');

    if (!seccion || !hero || !logo || !velo || !contenido || !navbar || !logoNavbar) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(navbar, { autoAlpha: 1, clearProps: 'all' });
      gsap.set(contenido, { autoAlpha: 1, clearProps: 'all' });
      gsap.set(velo, { autoAlpha: 0 });
      return;
    }

    const movimiento = { x: 0, y: 0, escala: 1 };

    const actualizarDestino = () => {
      gsap.set(logo, { x: 0, y: 0, scale: 1, autoAlpha: 1 });

      const origen = logo.getBoundingClientRect();
      const destino = logoNavbar.getBoundingClientRect();

      movimiento.x = destino.left + destino.width / 2 - (origen.left + origen.width / 2);
      movimiento.y = destino.top + destino.height / 2 - (origen.top + origen.height / 2);
      movimiento.escala = Math.max(destino.width / origen.width, 0.22);
    };

    const contexto = gsap.context(() => {
      actualizarDestino();

      // Arranco ocultando el navbar y el texto para que destaque el logo.
      gsap.set(navbar, { autoAlpha: 0.15, filter: 'blur(16px)' });
      gsap.set(contenido, { autoAlpha: 0, y: 24 });
      gsap.set(velo, { autoAlpha: 1 });

      gsap.timeline({
        scrollTrigger: {
          trigger: seccion,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
          pin: hero,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: actualizarDestino,
        },
      })
        .to(logo, { x: () => movimiento.x, y: () => movimiento.y, scale: () => movimiento.escala }, 0)
        .to(velo, { autoAlpha: 0 }, 0.1)
        .to(contenido, { autoAlpha: 1, y: 0 }, 0.2)
        .to(navbar, { autoAlpha: 1, filter: 'blur(0px)' }, 0.72)
        .to(logo, { autoAlpha: 0 }, 0.82);
    }, seccion);

    return () => {
      contexto.revert();
    };
  }, [tema]);

  return (
    <section ref={seccionRef} className="pt-4 pb-12 md:pt-6 md:pb-16">
      <div ref={heroRef} className="relative min-h-screen overflow-hidden rounded-3xl bg-white/40 shadow-xl">
<div className="absolute inset-0 overflow-hidden bg-linear-to-r from-transparent to-white/10">
  <div className={`absolute inset-0 bg-linear-to-r ${claseFondo}`} />
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />
        </div>

        <div ref={veloRef} className={`absolute inset-0 z-20 backdrop-blur-3xl ${claseVelo}`} />

        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-4">
          <div ref={logoRef} className={`flex h-40 w-40 items-center justify-center rounded-full border shadow-xl backdrop-blur-xl md:h-48 md:w-48 ${claseLogo}`}>
            <img src={rutaLogo} alt={t('navbar.logoAlt')} className="h-24 w-24 object-contain md:h-28 md:w-28" />
          </div>
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 text-center md:px-8">
          <div ref={contenidoRef} className={`w-full max-w-5xl rounded-3xl p-8 shadow-lg backdrop-blur-xl md:p-10 ${claseTarjeta}`}>
            <h1 className="mx-auto max-w-4xl text-4xl-h1 font-semibold leading-tight md:text-[4rem] md:leading-tight">
              {t('home.hero.title')}
            </h1>

            <p className={`mx-auto mt-6 max-w-3xl text-lg-subtitle leading-8 md:text-2xl ${claseSubtitulo}`}>
              {t('home.hero.subtitle')}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                type="button"
                onClick={() => navegar(estaAutenticado ? '/products' : '/registro')}
                className="min-w-52 px-8 py-3 text-base"
              >
                {t('home.hero.start')}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => navegar(estaAutenticado ? '/products' : '/iniciarSesion')}
                className="min-w-52 px-8 py-3 text-base"
              >
                {estaAutenticado ? t('home.hero.goToCollection') : t('home.hero.haveAccount')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
