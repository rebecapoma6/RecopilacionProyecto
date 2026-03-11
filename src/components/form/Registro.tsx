import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { validateField } from "../../utils/regex";
import Button from "./Button";
import InputField from "./InputField";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";
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
  const setSession = useAuthStore((state) => state.setSession);
  const userRepository = createUserRepository();

  const [datosFormulario, setDatosFormulario] = useState<DatosFormularioProps>({ username: "", email: "", password: "", passwordRepeat: "" });
  const [errors, setErrors] = useState<ErrorsProps>({ username: "", email: "", password: "", passwordRepeat: "" });
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ErrorsProps]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "passwordRepeat") {
      setErrors((prev) => ({ ...prev, passwordRepeat: value !== datosFormulario.password ? "Las contraseñas no coinciden" : "" }));
      return;
    }
    const error = validateField(name === "username" ? "nombre" : name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setAvatarFile(e.target.files[0]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = {
      username: validateField("nombre", datosFormulario.username),
      email: validateField("email", datosFormulario.email),
      password: validateField("password", datosFormulario.password),
      passwordRepeat: datosFormulario.password !== datosFormulario.passwordRepeat ? "Las contraseñas no coinciden" : "",
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error !== "")) return;

    setLoading(true);

    try {
      const dataToSend = {
        email: datosFormulario.email,
        password: datosFormulario.password,
        username: datosFormulario.username,
        role: 'user',
        avatar_file: avatarFile || undefined,
      };

      const { data, error } = await userRepository.createUser(dataToSend);
      if (error) {
        const msg = error.message?.toLowerCase() || "";
        if (msg.includes("already") || msg.includes("registrado") || msg.includes("exists")) {
          setErrors((prev) => ({ ...prev, email: "Este email no se encuentra disponible" }));
        } else {
          toast.error("Error al registrar: " + error.message);
        }
      } else if (data && data.user) {
        await setSession(data, data.user);
        toast.success(`Bienvenido ${data.profile?.username || datosFormulario.username}`);
        navigate('/products');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      const msg = message.toLowerCase();
      if (msg.includes("already") || msg.includes("registrado") || msg.includes("exists") || msg.includes("422")) {
        setErrors((prev) => ({ ...prev, email: "Este email no se encuentra disponible" }));
      } else {
        toast.error(message || "Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-left">
        <p className="app-muted mt-1 text-sm">Crea una nueva cuenta para comenzar.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField id="username" label="Nombre de usuario" name="username" type="text" placeholder="Tu nombre de usuario" value={datosFormulario.username} onChange={handleChange} onBlur={handleBlur} error={errors.username} />
        <InputField id="email" label="Correo" name="email" type="email" placeholder="Tu correo electrónico" value={datosFormulario.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} />
        <InputField id="password" label="Contraseña" name="password" type="password" placeholder="Tu contraseña" value={datosFormulario.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} />
        <InputField id="passwordRepeat" label="Repetir contraseña" name="passwordRepeat" type="password" placeholder="Repite tu contraseña" value={datosFormulario.passwordRepeat} onChange={handleChange} onBlur={handleBlur} error={errors.passwordRepeat} />

        <div className="flex flex-col gap-2">
          <label htmlFor="avatar" className="app-muted text-sm font-medium">Foto de perfil opcional</label>
          <input id="avatar" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} className="text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary-100 file:px-4 file:py-2 file:font-semibold file:text-primary-50 hover:file:bg-primary-300" />
        </div>

        <div className="flex flex-col gap-3 pt-3 sm:flex-row">
          <Button type="button" onClick={() => navigate('/')} variant="secondary" className="w-full">Cancelar</Button>
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Registrando...' : 'Registrarse'}</Button>
        </div>
      </form>
    </div>
  );
}
