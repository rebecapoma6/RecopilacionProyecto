import { Link, useNavigate } from 'react-router-dom';
import Button from '../form/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { createUserRepository } from '../../database/repositories';
import { Moon, UserCircle } from 'lucide-react';

export default function Navbar() {
    const { isAuthenticated, isAdmin,sessionUser, clearSession } = useAuthStore();
    const userRepository = createUserRepository();
    const navigate = useNavigate();

   const nombre = sessionUser?.profile?.username || "Usuario";
    const avatar = sessionUser?.profile?.avatar_url;

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
                   <>
                        <div className="flex items-center space-x-2 bg-blue-700 px-3 py-1 rounded-full">
                            {avatar ? (
                                <img 
                                    src={avatar} 
                                    alt="Avatar" 
                                    className="w-8 h-8 rounded-full border border-white object-cover" 
                                />
                            ) : (
                                <UserCircle size={24} />
                            )}
                            <span className="text-sm font-medium text-white">¡Hola, {nombre}!</span>
                        </div>

                        {isAdmin ? (
                            <>
                                <Link to="/vistaAdmin" className="hover:underline">Administrador</Link>
                                <Link to="/estadisticas" className="hover:underline">Estadísticas</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/perfil" className="hover:underline">Perfil</Link>
                                <Link to="/modificar-datos" className="hover:underline">Modificar Datos</Link>
                            </>
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