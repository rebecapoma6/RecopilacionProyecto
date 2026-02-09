export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center">
      <p>&copy; 2026 StoryPlay. Todos los derechos reservados.</p>
      <div className="mt-2">
        <a href="/privacy" className="mx-2 hover:underline">Privacidad</a>
        <a href="/terms" className="mx-2 hover:underline">Términos</a>
        <a href="/contact" className="mx-2 hover:underline">Contacto</a>
      </div>
    </footer>
  );
}