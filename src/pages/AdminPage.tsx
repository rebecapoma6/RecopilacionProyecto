import AdminUsersTable from "../components/form/AdminUsersTable";



export default function AdminPage(){
    return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración de Usuarios</h1>
      <p className="mb-4 text-gray-600">
        Aquí puedes ver a todos los usuarios registrados en la plataforma y gestionar sus roles.
      </p>
      
      {/* Llamamos al componente que tiene toda la lógica */}
      <AdminUsersTable />
    </div>
  );
};

