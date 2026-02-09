<<<<<<< HEAD
import Button from '../form/Button';

export default function HeroSection() {
  return (
    <section className="bg-gray-100 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a Nuestra Landing Page</h1>
      <p className="text-lg mb-6">Descubre productos increíbles y únete a nuestra comunidad hoy mismo.</p>
      <Button variant="primary">Explorar Productos</Button>
    </section>
  );
=======
export function HeroSection() {
    return (
        <section className="font-sf-pro py-20 px-4 flex justify-center text-center">

            <div className="max-w-3xl w-full">

                <h1 className="text-4xl-h1 font-bold text-primary-50 mb-6">Tu biblioteca personal de libros y videojuegos</h1>
                <p className="text-lg-subtitle text-primary-50 mb-10 max-w-2xl mx-auto">Organiza, gestiona y lleva el control de toda tu coleccción en un solo lugar.</p>
            </div>
        </section>
    )
>>>>>>> 4b7b003b4c8ec6515873c4f3b33aec606d110a26
}