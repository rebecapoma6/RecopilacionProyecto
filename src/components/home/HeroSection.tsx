import Button from '../form/Button';

export default function HeroSection() {
  return (
    <section className="bg-gray-100 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a Nuestra Landing Page</h1>
      <p className="text-lg mb-6">Descubre productos increíbles y únete a nuestra comunidad hoy mismo.</p>
      <Button variant="primary">Explorar Productos</Button>
    </section>
  );
}