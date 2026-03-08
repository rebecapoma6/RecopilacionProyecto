import EstadisticasDashboard from "../components/admin/EstadisticasDashboard";

export default function EstadisticasPage() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-2 text-gray-800">Estadísticas del Sistema</h1>
            <p className="mb-8 text-gray-600">
                Visión general de los datos almacenados en StoryPlay.
            </p>
            
            {/* Llamamos al componente gráfico */}
            <EstadisticasDashboard />
        </div>
    );
}