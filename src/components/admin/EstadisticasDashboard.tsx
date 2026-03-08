import { useEffect, useState, type SetStateAction } from "react";
import { createProductRepository, createUserRepository } from "../../database/repositories";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

export default function EstadisticasDashboard(){
    const [totalUsuarios, setTotalUsuarios] = useState(0);
    const [totalProductos, setTotalProductos] = useState(0);
    const [datosGrafica, setDatosGrafica] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const userRepository = createUserRepository();
    const productRepository = createProductRepository();

    useEffect(() => {
        const cargarDatos = async () => {
            // Obtenemos los datos reales
            const { data: usuarios } = await userRepository.fetchAdminUsersList();
            const { data: productos } = await productRepository.fetchAllProducts();

            if (usuarios && productos) {
                setTotalUsuarios(usuarios.length);
                setTotalProductos(productos.length);

                const ultimos7Dias: SetStateAction<any[]> = [];
                for (let i = 6; i >= 0; i--) {
                    const fecha = new Date();
                    fecha.setDate(fecha.getDate() - i);
                    ultimos7Dias.push({
                        name: fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }), // Ej: "08 mar"
                        libros: 0,
                        videojuegos: 0
                    });
                }

                
                productos.forEach(producto => {
                    const fechaProducto = new Date(producto.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
                    
                    const diaCorrespondiente = ultimos7Dias.find(d => d.name === fechaProducto);
                    
                    if (diaCorrespondiente) {
                        if (producto.tipo?.toLowerCase() === 'libro') {
                            diaCorrespondiente.libros += 1;
                        } else {
                            diaCorrespondiente.videojuegos += 1;
                        }
                    }
                });

                setDatosGrafica(ultimos7Dias);
            }
            setLoading(false);
        };

        cargarDatos();
    }, []);

    if (loading) return <p className="text-center py-10">Cargando estadísticas...</p>;

    return (
        <div className="space-y-8">
            {/* 1. TARJETAS DE RESUMEN (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Clientes Registrados</h3>
                    <p className="text-4xl font-extrabold text-blue-600 mt-2">{totalUsuarios}</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Total Productos (Catálogo)</h3>
                    <p className="text-4xl font-extrabold text-green-600 mt-2">{totalProductos}</p>
                </div>
            </div>

            {/* 2. GRÁFICA DE ÁREA (DISEÑO OFICIAL RECHARTS) */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-700 mb-6 text-center">Registro de Ítems (Últimos 7 días)</h3>
                
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <AreaChart
                            data={datosGrafica}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            
                            <defs>
                                <linearGradient id="colorLibros" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorJuegos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} /> {/* allowDecimals={false} para que no ponga 1.5 libros */}
                            <Tooltip />
                            <Legend verticalAlign="top" height={36}/>
                            
                            <Area
                                type="monotone"
                                dataKey="libros"
                                name="Libros Registrados"
                                stroke="#8884d8"
                                fillOpacity={1}
                                fill="url(#colorLibros)"
                                isAnimationActive={true}
                            />
                            <Area
                                type="monotone"
                                dataKey="videojuegos"
                                name="Videojuegos Registrados"
                                stroke="#82ca9d"
                                fillOpacity={1}
                                fill="url(#colorJuegos)"
                                isAnimationActive={true}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}