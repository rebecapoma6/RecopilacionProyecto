import EstadisticasDashboard from "../components/admin/EstadisticasDashboard";

export default function EstadisticasPage() {
  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
      <h1 className="mb-2 text-2xl font-bold">Estadísticas del Sistema</h1>
      <p className="app-muted mb-8">Visión general de los datos almacenados en StoryPlay.</p>
      <EstadisticasDashboard />
    </div>
  );
}
