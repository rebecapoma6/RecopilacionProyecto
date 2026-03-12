import { useEffect, useState } from "react";
import { createUserRepository } from "../../database/repositories";
import toast, { Toaster } from 'react-hot-toast';
import Swal from "sweetalert2";

export default function AdminUsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  const userRepository = createUserRepository();

  useEffect(() => {
    const loadUsers = async () => {
      const { data, error } = await userRepository.fetchAdminUsersList();

      if (error) {
        setError("No tienes permisos o hubo un error al cargar los usuarios.");
      } else if (data) {
        setUsers(data);
      }
      setLoading(false);
    };

    void loadUsers();
  }, []);

  const handleEditClick = (user: any) => {
    setEditingId(user.id);
    setNewRole(user.role);
  };

  const handleCancelEdit = () => setEditingId(null);

  const handleSaveRole = async (userId: string) => {
    const { error } = await userRepository.updateUserRole(userId, newRole);

    if (error) {
      toast.error("Error al actualizar el rol");
    } else {
      toast.success("Rol actualizado correctamente");
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      setEditingId(null);
    }
  };

  const handleDeleteUser = async (user: any) => {
    const result = await Swal.fire({
      title: '¿Estás segura?',
      text: `El usuario "${user.username || user.email}" y todos sus datos serán eliminados permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'rounded-2xl' },
    });

    if (result.isConfirmed) {
      const { error } = await userRepository.deleteUser(user.id);

      if (error) {
        toast.error("Error al eliminar el usuario");
        console.error(error);
      } else {
        toast.success("Usuario eliminado correctamente");
        setUsers(users.filter((u) => u.id !== user.id));
      }
    }
  };

  if (loading) return <p className="app-muted">Cargando lista de usuarios...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="app-surface-strong overflow-x-auto rounded-3xl border p-4 shadow-md">
      <Toaster position="top-center" />

      <table className="min-w-full border-collapse rounded-2xl border border-[var(--app-border)] overflow-hidden">
        <thead className="app-surface">
          <tr>
            <th className="border border-[var(--app-border)] p-3 text-left">Usuario</th>
            <th className="border border-[var(--app-border)] p-3 text-left">Email</th>
            <th className="border border-[var(--app-border)] p-3 text-left">Rol</th>
            <th className="border border-[var(--app-border)] p-3 text-left">Registro</th>
            <th className="border border-[var(--app-border)] p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="transition-colors hover:bg-[rgba(47,107,255,0.08)]">
              <td className="border border-[var(--app-border)] p-3">
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="app-chip flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span>{user.username || 'Sin nombre'}</span>
                </div>
              </td>
              <td className="app-muted border border-[var(--app-border)] p-3 text-sm">{user.email}</td>
              <td className="border border-[var(--app-border)] p-3">
                {editingId === user.id ? (
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="app-input rounded-lg border px-2 py-1 text-sm"
                  >
                    <option value="user">USER</option>
                    <option value="admin">ADMIN</option>
                  </select>
                ) : (
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'app-chip border'}`}>
                    {user.role || 'user'}
                  </span>
                )}
              </td>
              <td className="app-muted border border-[var(--app-border)] p-3 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
              <td className="border border-[var(--app-border)] p-3">
                {editingId === user.id ? (
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleSaveRole(user.id)} className="rounded-lg bg-green-500 px-3 py-1 text-sm text-white transition hover:bg-green-600">
                      Guardar
                    </button>
                    <button onClick={handleCancelEdit} className="rounded-lg bg-gray-400 px-3 py-1 text-sm text-white transition hover:bg-gray-500">
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleEditClick(user)} className="rounded-lg bg-blue-500 px-3 py-1 text-sm text-white transition hover:bg-blue-600">
                      Editar Rol
                    </button>
                    <button onClick={() => handleDeleteUser(user)} className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white transition hover:bg-red-600">
                      Borrar
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
