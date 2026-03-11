import { Outlet } from "react-router-dom";
import { BookOpen, Gamepad2, Zap } from "lucide-react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import CardHome from "../components/home/CardHome";

const features = [
  {
    title: "Gestiona tus libros",
    content: "Añade todos tus libros favoritos, registra autores, año de publicación y mucho más.",
    icon: <BookOpen size={28} strokeWidth={2.2} />,
  },
  {
    title: "Catálogo de videojuegos",
    content: "Lleva el control de tu colección de videojuegos, desde clásicos hasta los más recientes.",
    icon: <Gamepad2 size={28} strokeWidth={2.2} />,
  },
  {
    title: "Rápido y sencillo",
    content: "Añade, edita y elimina items de tu colección con solo unos clics. Interfaz intuitiva.",
    icon: <Zap size={28} strokeWidth={2.2} />,
  },
];

export default function LandingLayout() {
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
