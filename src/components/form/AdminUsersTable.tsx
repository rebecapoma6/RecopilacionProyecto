import { useEffect, useState } from "react";
import { createUserRepository } from "../../database/repositories";


export default function AdminUsersTable(){
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


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

    if (loading) return <p>Cargando lista de usuarios...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="overflow-x-auto">
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
                        <tr key={user.id} className="text-center">
                            <td className="border p-2 flex items-center justify-center gap-2">
                                {user.avatar_url && (
                                    <img src={user.avatar_url} alt="avatar" className="w-8 h-8 rounded-full" />
                                )}
                                {user.username || 'Sin nombre'}
                            </td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2 font-bold uppercase">{user.role}</td>
                            <td className="border p-2">
                                {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="border p-2">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded">
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    )

};