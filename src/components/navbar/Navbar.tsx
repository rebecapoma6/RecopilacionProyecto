import { Link } from 'react-router-dom';
import Button from '../form/Button';

export default function Navbar() {
  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold">StoryPlay</Link>
      <div className="flex items-center space-x-4">
        <Link to="/products" className="hover:underline">Productos</Link>
        <Link to="/profile" className="hover:underline">Perfil</Link>
        <Link to="/sign-in">
          <Button variant="secondary">Iniciar Sesión</Button>
        </Link>
        <Link to="/registro">
          <Button variant="primary">Registro</Button>
        </Link>
      </div>
    </nav>
  );
}