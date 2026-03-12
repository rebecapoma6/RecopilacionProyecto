import { useState, useEffect, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { validateField } from "../../utils/regex";
import Button from "./Button";
import InputField from "./InputField";
import ImageInput from "./ImageInput";
import { SupabaseUserRepository } from "../../database/supabase/SupabaseUserRepository";
import { useAuthStore } from "../../store/useAuthStore";

const userRepository = new SupabaseUserRepository();

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

export default function EditarPerfil() {
  const sessionUser = useAuthStore((state) => state.sessionUser);
  const setSession = useAuthStore((state) => state.setSession);

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
    passwordRepeat: "",
  });

  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(sessionUser?.profile?.avatar_url || null);

  useEffect(() => {
    if (sessionUser) {
      setDatosFormulario({
        username: sessionUser.profile?.username || "",
        email: sessionUser.user?.email || "",
        password: "",
        passwordRepeat: "",
      });
      setAvatarUrl(sessionUser.profile?.avatar_url || null);
      return;
    }

    const cargarUsuario = async () => {
      try {
        const { data: user, error } = await userRepository.getCurrentUser();
        if (error || !user) {
          alert("No se pudo cargar tu perfil. Inicia sesión nuevamente.");
          return;
        }

        setDatosFormulario({
          username: (user.user_metadata?.username as string) || "",
          email: user.email || "",
          password: "",
          passwordRepeat: "",
        });
      } catch (err) {
        console.error(err);
        alert("Error al cargar perfil");
      }
    };

    void cargarUsuario();
  }, [sessionUser]);

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
      if (datosFormulario.password && value !== datosFormulario.password) {
        setErrors((prev) => ({ ...prev, passwordRepeat: "Las contraseñas no coinciden" }));
      } else {
        setErrors((prev) => ({ ...prev, passwordRepeat: "" }));
      }
      return;
    }

    if (name === "password") {
      const error = value ? validateField("password", value) : "";
      setErrors((prev) => ({ ...prev, password: error }));
      return;
    }

    const error = validateField(name === "username" ? "nombre" : name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: ErrorsProps = {
      username: validateField("nombre", datosFormulario.username),
      email: validateField("email", datosFormulario.email),
      password: datosFormulario.password ? validateField("password", datosFormulario.password) : "",
      passwordRepeat: datosFormulario.password ? (datosFormulario.password !== datosFormulario.passwordRepeat ? "Las contraseñas no coinciden" : "") : "",
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) return;

    setLoading(true);

    try {
      const dataToSend = {
        username: datosFormulario.username,
        email: datosFormulario.email,
        password: datosFormulario.password || undefined,
        avatar_file: avatarFile || undefined,
        avatar_url: avatarUrl,
      };

      const { data, error } = await userRepository.updateUser(dataToSend);

      if (error) {
        alert("Error al actualizar: " + (error.message || "Error desconocido"));
      } else {
        if (data?.user) {
          await setSession(data, data.user);
          setAvatarUrl(data.profile?.avatar_url || null);
        }
        alert("Datos actualizados correctamente");
      }
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-left">
        <p className="app-muted mt-1 text-sm">Actualiza tu información personal y tu foto de perfil.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="app-surface rounded-2xl border p-4">
          <p className="mb-3 text-sm font-medium">Foto de perfil</p>
          <ImageInput name="avatar-perfil" defaultImageUrl={avatarUrl} onFileSelect={handleAvatarChange} />
        </div>

        <InputField id="username" label="Nombre de usuario" name="username" type="text" placeholder="Tu nombre de usuario" value={datosFormulario.username} onChange={handleChange} onBlur={handleBlur} error={errors.username} />
        <InputField id="email" label="Correo electrónico" name="email" type="email" placeholder="Tu correo electrónico" value={datosFormulario.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} />
        <InputField id="password" label="Nueva contraseña (opcional)" name="password" type="password" placeholder="Nueva contraseña" value={datosFormulario.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} />
        <InputField id="passwordRepeat" label="Repetir nueva contraseña" name="passwordRepeat" type="password" placeholder="Repetir nueva contraseña" value={datosFormulario.passwordRepeat} onChange={handleChange} onBlur={handleBlur} error={errors.passwordRepeat} />

        <div className="flex flex-col gap-3 pt-3 sm:flex-row">
          <Button type="button" onClick={() => window.history.back()} variant="secondary" className="w-full">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
