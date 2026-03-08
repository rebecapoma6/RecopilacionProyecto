import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserRepository } from '../../database/repositories'; 
import { useAuthStore } from '../../store/useAuthStore'; 
import toast, { Toaster } from 'react-hot-toast'; 

import InputField from '../form/InputField';
import Button from '../form/Button';
import '../../index.css'; 
import { validateField } from '../../utils/regex';

interface DatosFormularioProps {
  email: string,
  password: string
}

interface ErrorsProps {
  email: string,
  password: string
}

export default function IniciarSesion() {
  // --- HOOKS Y CONFIGURACIÓN ---
  const navigate = useNavigate();
  const setSession = useAuthStore(state => state.setSession); 
  const userRepository = createUserRepository(); 

  // --- ESTADOS ---
  const [loading, setLoading] = useState(false); 
  const [datosFormulario, setDatosFormulario] = useState<DatosFormularioProps>({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState<ErrorsProps>({
    email: "",
    password: ""
  });

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
    
    setErrors({ ...errors, [e.target.name]: "" });
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validaciones locales (Regex)
    const newErrors = {
      email: validateField("email", datosFormulario.email),
      password: validateField("password", datosFormulario.password)
    };
    setErrors(newErrors);
  
    
    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    
    setLoading(true); 

    try {
        const result = await userRepository.login(datosFormulario.email, datosFormulario.password);

        if (result.error) {
            
            toast.error(result.error.message || 'Credenciales inválidas');
        } 
        else if (result.data) {
           // Extraemos el objeto 'user'
            const supabaseUser = result.data.user; 

            // Validamos que el usuario realmente esté ahí para calmar a TypeScript
            if (!supabaseUser) {
                toast.error('No se pudo recuperar la información del usuario');
                return;
            }

            // Ahora TypeScript sabe que supabaseUser NO es null
            setSession(result.data, supabaseUser);
            
           
            toast.success('¡Bienvenido de nuevo!');

            
            navigate("/"); 
        }

    } catch (err) {
        toast.error('Ocurrió un error de conexión');
        console.error(err);
    } finally {
        setLoading(false); 
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <Toaster position="top-center" /> 

      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-xl m-15">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h1>
          <p className="text-gray-500">Ingresa tus credenciales para acceder</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <div>
            <InputField
                label="Email"
                id="email"
                type="email"
                name="email"
                value={datosFormulario.email}
                onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div>
            <InputField
                label="Contraseña"
                id="password"
                type="password"
                name="password"
                value={datosFormulario.password}
                onChange={handleChange}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            
            {/* ENLACE DE RECUPERACIÓN - Ahora bien ubicado */}
            <div className="flex justify-end mt-1">
              <Link 
                to="/recuperarPass" 
                className="text-xs text-blue-600 hover:text-blue-800 transition font-medium"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              onClick={() => navigate("/")} 
              className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition cursor-pointer"
            >
              Volver
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-medium rounded-lg transition ${
                  loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              }`}
            >
              {loading ? 'Entrando...' : 'Iniciar Sesión'}
            </Button>
          </div>

          {/* SECCIÓN DE REGISTRO INTEGRADA */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600">
              ¿Todavía no eres parte de StoryPlay?
            </p>
            <Link 
              to="/registro" 
              className="inline-block mt-2 text-blue-600 font-bold hover:text-blue-800 hover:underline transition"
            >
              Crea tu cuenta ahora
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}