import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore"; // <-- He dejado la ruta con un solo ../ asumiendo que está en pages/
import Button from "../components/form/Button"; 
import Footer from "../components/footer/Footer";

export default function PerfilUsuarioPage() {
  const navigate = useNavigate();
  
  // ✨ AQUÍ ESTABA EL FALLO: Ahora usamos sessionUser en lugar de session
  const sessionUser = useAuthStore((state) => state.sessionUser);

  // Si no hay usuario logueado, mostramos un aviso
  if (!sessionUser) {
    return (
      <div className="w-screen h-screen flex flex-col justify-between bg-neutral-100 font-sf-pro">
        <div className="flex-grow flex justify-center items-center">
          <p className="text-gray-500">No estás logueado. Inicia sesión para ver tu perfil.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // ✨ Y cambiamos todo a sessionUser aquí también
  const email = sessionUser.user?.email || "Correo no disponible";
  const username = sessionUser.profile?.username || "Usuario";
  
  // Si no tiene avatar_url, le ponemos una imagen por defecto generada con sus iniciales
  const avatarUrl = sessionUser.profile?.avatar_url || "https://ui-avatars.com/api/?name=" + username + "&background=random";

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 font-sf-pro">
      
      <div className="flex-grow flex justify-center items-center p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl flex flex-col items-center">
          
          <h1 className="text-2xl font-bold text-primary-50 mb-6">Mi Perfil</h1>
          
          {/* Imagen del Avatar */}
          <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm">
            <img 
              src={avatarUrl} 
              alt={`Avatar de ${username}`} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Datos del usuario */}
          <h2 className="text-xl font-semibold text-gray-800">{username}</h2>
          <p className="text-gray-500 mb-8">{email}</p>

          {/* Botones de acción */}
          <div className="w-full flex flex-col gap-3">
            <Button
              type="button"
              onClick={() => navigate("/modificar-datos")}
              className="w-full py-2 text-white font-medium rounded-lg bg-primary-50 hover:bg-primary-700 transition"
            >
              Modificar Perfil
            </Button>
            
            <Button
              type="button"
              onClick={() => navigate("/")}
              className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              Volver al inicio
            </Button>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}