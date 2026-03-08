import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { validateField } from "../../utils/regex";
import Button from "./Button";
import InputField from "./InputField";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

// Importamos el cliente desde tu archivo Client.ts
//import { supabase } from "../../database/supabase/Client"; 
import { createUserRepository } from "../../database/repositories";


interface DatosFormularioProps {
  username: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

interface ErrorsProps {
  username: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

export default function Registro() {
 const navigate = useNavigate();
  const setSession = useAuthStore(state => state.setSession);
  
  // Instanciamos el repositorio usando la fábrica
  const userRepository = createUserRepository();
  
  const [datosFormulario, setDatosFormulario] = useState<DatosFormularioProps>({
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });

  const [errors, setErrors] = useState<ErrorsProps>({
    username: "",
    email: "",
    password: "",
    passwordRepeat: ""
  });

  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ErrorsProps]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "passwordRepeat") {
      if (value !== datosFormulario.password) {
        setErrors((prev) => ({ ...prev, passwordRepeat: "Las contraseñas no coinciden" }));
      } else {
        setErrors((prev) => ({ ...prev, passwordRepeat: "" }));
      }
      return;
    }

    const error = validateField(name === "username" ? "nombre" : name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors = {
      username: validateField("nombre", datosFormulario.username),
      email: validateField("email", datosFormulario.email),
      password: validateField("password", datosFormulario.password),
      passwordRepeat: datosFormulario.password !== datosFormulario.passwordRepeat
        ? "Las contraseñas no coinciden"
        : "",
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) return;

    setLoading(true);

    try {
      // Armamos el objeto tal cual lo pide la interfaz RegisterData
      const dataToSend = {
        email: datosFormulario.email,
        password: datosFormulario.password,
        username: datosFormulario.username,
        role: 'user',
        avatar_file: avatarFile || undefined 
      };

      // El repositorio se encarga de subir la imagen y registrar al usuario
      const { data, error } = await userRepository.createUser(dataToSend);

      if (error) {
        const msg = error.message?.toLowerCase() || "";
        if (msg.includes("already") || msg.includes("registrado") || msg.includes("exists")) {
          setErrors((prev) => ({ ...prev, email: "Este email no se encuentra disponible" }));
        } else {
          toast.error("Error al registrar: " + error.message);
        }
      } else if (data) {
        setSession(data);
        toast.success(`¡Bienvenido ${data.profile?.username || datosFormulario.username}!`);
        navigate("/");
      }

    } catch (err: any) {
      const msg = err.message?.toLowerCase() || "";
      if (msg.includes("already") || msg.includes("registrado") || msg.includes("exists") || msg.includes("422")) {
        setErrors((prev) => ({ ...prev, email: "Este email no se encuentra disponible" }));
      } else {
        toast.error(err.message || "Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-neutral-100 font-sf-pro">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
        <div className="text-left mb-6">
          <h1 className="text-2xl font-bold text-primary-50 mb-1">Crear Cuenta</h1>
          <p className="text-neutral-500 text-sm">Crea una nueva cuenta para comenzar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField id="username" label="username" name="username" type="text" placeholder="Tu nombre de usuario" value={datosFormulario.username} onChange={handleChange} onBlur={handleBlur} error={errors.username} />
          <InputField id="email" label="Correo" name="email" type="email" placeholder="Tu correo electrónico" value={datosFormulario.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} />
          <InputField id="password" label="Contraseña" name="password" type="password" placeholder="contraseña" value={datosFormulario.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} />
          <InputField id="passwordRepeat" label="Repetir contraseña" name="passwordRepeat" type="password" placeholder="contraseña" value={datosFormulario.passwordRepeat} onChange={handleChange} onBlur={handleBlur} error={errors.passwordRepeat} />

          <div className="flex flex-col gap-1">
            <label htmlFor="avatar" className="text-sm font-medium text-neutral-600">Foto de perfil (opcional)</label>
            <input id="avatar" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} className="text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-white hover:file:bg-primary-700 cursor-pointer" />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" onClick={() => navigate("/")} className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition cursor-pointer">Cancelar</Button>
            <Button type="submit" disabled={loading} className={`w-full py-2 text-white font-medium rounded-lg transition ${loading ? 'bg-primary-400' : 'bg-primary-50 hover:bg-primary-700'}`}>{loading ? "Registrando..." : "Registrarse"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}