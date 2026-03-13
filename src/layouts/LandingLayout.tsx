import { Outlet } from 'react-router-dom';
import { BookOpen, Gamepad2, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import CardHome from '../components/home/CardHome';

export default function LandingLayout() {
  const { t } = useTranslation();

  const features = [
    {
      title: t('home.features.books.title'),
      content: t('home.features.books.content'),
      icon: <BookOpen size={28} strokeWidth={2.2} />,
    },
    {
      title: t('home.features.games.title'),
      content: t('home.features.games.content'),
      icon: <Gamepad2 size={28} strokeWidth={2.2} />,
    },
    {
      title: t('home.features.simple.title'),
      content: t('home.features.simple.content'),
      icon: <Zap size={28} strokeWidth={2.2} />,
    },
  ];

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl grow flex-col px-4 md:px-6">
        <Outlet />
        <section className="pb-10 md:pb-14">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <CardHome key={feature.title} title={feature.title} content={feature.content} icon={feature.icon} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
