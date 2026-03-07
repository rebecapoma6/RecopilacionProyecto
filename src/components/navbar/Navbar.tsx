import { Link, useNavigate } from 'react-router-dom';
import Button from '../form/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { createUserRepository } from '../../database/repositories';
import { Moon } from 'lucide-react';

export default function Navbar() {
   const { isAuthenticated,isAdmin, clearSession } = useAuthStore();
    const userRepository = createUserRepository();
    
    const navigate = useNavigate();
    const handleLogout = async () => {
        const { error } = await userRepository.logout()
        if (!error) {
            clearSession()
            navigate('/');
        }
    }

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center shadow-md">
            <Link to="/" className="text-xl font-bold">StoryPlay</Link>

            <div className="flex items-center space-x-4">
                

                {isAuthenticated ? (
                    // Lo que ve el usuario cuando YA está logueado 
                    <>
                        {/* <Link to="/products" className="hover:underline">Productos</Link> */}
                        <Link to="/profile" className="hover:underline">Perfil</Link>
                        {/* <Link to="/agregar-items" className="hover:underline">Añadir</Link> */}
                        <Link to="/modificar-datos" className="hover:underline">Modificar Datos</Link>
                          {isAdmin && (
                        <Link to="/vistaAdmin">Administrador</Link>
                    )}
                        <Button variant="secondary" onClick={handleLogout}>
                            Cerrar sesión
                        </Button>
                    </>
                ) : (
                    // Lo que ve el usuario cuando NO está logueado
                    <>
                        <Link to="/iniciarSesion">
                            <Button variant="secondary">Iniciar Sesión</Button>
                        </Link>
                        
                    </>
                )}
                
                {/* icono para el modo oscuro*/}
                <button 
                    onClick={() => console.log("Pronto: Modo Oscuro")} 
                    className="p-2 hover:bg-blue-600 rounded-full transition-colors"
                    title="Cambiar modo"
                >
                    <Moon size={22} strokeWidth={2} /> 
                </button>
            </div>
        </nav>
  );
}