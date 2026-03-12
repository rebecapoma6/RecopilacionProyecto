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

        loadUsers();
    }, []);


    const handleEditClick = (user: any) => {
        setEditingId(user.id); // Guardamos el ID del usuario que vamos a editar
        setNewRole(user.role); // Rellenamos el select con su rol actual
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const handleSaveRole = async (userId: string) => {
        const { error } = await userRepository.updateUserRole(userId, newRole);

        if (error) {
            toast.error("Error al actualizar el rol");
        } else {
            toast.success("Rol actualizado correctamente");
            // Actualizamos la lista localmente para no tener que recargar la página
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            setEditingId(null); // Salimos del modo edición
        }
    };

    const handleDeleteUser = async (user: any) => {

        const result = await Swal.fire({
            title: '¿Estás segura?',
            text: `El usuario "${user.username || user.email}" y todos sus datos serán eliminados permanentemente.`, icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#9ca3af',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'rounded-2xl'
            }
        });
        if (result.isConfirmed) {
            const { error } = await userRepository.deleteUser(user.id);

            if (error) {
                toast.error("Error al eliminar el usuario");
                console.error(error);
            } else {
                toast.success("Usuario eliminado correctamente 🗑️");
                setUsers(users.filter(u => u.id !== user.id));
            }
        }
    };

    if (loading) return <p>Cargando lista de usuarios...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
            <Toaster position="top-center" />

            <table className="min-w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">Usuario</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Rol</th>
                        <th className="border p-2">Registro</th>
                        <th className="border p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="text-center hover:bg-gray-50 transition-colors">
                            <td className="border p-2 flex items-center justify-center gap-2">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                                        {user.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                                {user.username || 'Sin nombre'}
                            </td>
                            <td className="border p-2 text-sm">{user.email}</td>

                            {/* COLUMNA DE ROL DINÁMICA */}
                            <td className="border p-2">
                                {editingId === user.id ? (
                                    <select
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                        className="border border-gray-300 rounded p-1 text-sm bg-white"
                                    >
                                        <option value="user">USER</option>
                                        <option value="admin">ADMIN</option>
                                    </select>
                                ) : (
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {user.role}
                                    </span>
                                )}
                            </td>

                            <td className="border p-2 text-sm">
                                {new Date(user.created_at).toLocaleDateString()}
                            </td>

                            {/* COLUMNA DE ACCIONES DINÁMICA */}
                            <td className="border p-2">
                                {editingId === user.id ? (
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => handleSaveRole(user.id)}
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition"
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
                                        >
                                            Editar Rol
                                        </button>
                                    
                                        <button
                                            onClick={() => handleDeleteUser(user)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                                        >
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

    )

};