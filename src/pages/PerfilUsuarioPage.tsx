import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Button from "../components/form/Button";

export default function PerfilUsuarioPage() {
  const navigate = useNavigate();
  const sessionUser = useAuthStore((state) => state.sessionUser);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  if (!sessionUser) {
    return (
      <div className="app-surface mx-auto flex min-h-[50vh] max-w-3xl items-center justify-center rounded-3xl border p-6 text-center shadow-sm">
        No estás logueado. Inicia sesión para ver tu perfil.
      </div>
    );
  }

  const email = sessionUser.user?.email || "Correo no disponible";
  const username = sessionUser.profile?.username || "Usuario";
  const avatarUrl = sessionUser.profile?.avatar_url || `https://ui-avatars.com/api/?name=${username}&background=random`;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl items-center justify-center py-6">
      <div className="app-surface-strong w-full rounded-3xl border p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-6 text-2xl font-bold">Mi perfil</h1>

          <div className="mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-[var(--app-border)] shadow-sm">
            <img src={avatarUrl} alt={`Avatar de ${username}`} className="h-full w-full object-cover" />
          </div>

          <h2 className="text-xl font-semibold">{username}</h2>
          <p className="app-muted mb-8">{email}</p>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={() => navigate("/modificar-datos")} className="w-full">
              Modificar perfil
            </Button>
            {!isAdmin && (
              <Button type="button" onClick={() => navigate("/products")} variant="secondary" className="w-full">
                Volver a la colección
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
