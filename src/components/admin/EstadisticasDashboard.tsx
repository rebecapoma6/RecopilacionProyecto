import { useEffect, useMemo, useState, type CSSProperties, type SetStateAction } from "react";
import { createProductRepository, createUserRepository } from "../../database/repositories";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
import { useThemeStore } from "../../store/useThemeStore";
import { useTranslation } from "react-i18next";

export default function EstadisticasDashboard() {
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalProductos, setTotalProductos] = useState(0);
  const [datosGrafica, setDatosGrafica] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useThemeStore((state) => state.theme);
  const { t } = useTranslation();


  const userRepository = createUserRepository();
  const productRepository = createProductRepository();


  useEffect(() => {
    const cargarDatos = async () => {
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
            name: fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
            libros: 0,
            videojuegos: 0,
          });
        }

        productos.forEach((producto) => {
          const fechaProducto = new Date(producto.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
          const diaCorrespondiente = ultimos7Dias.find((d) => d.name === fechaProducto);

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

    void cargarDatos();
  }, []);

  const chartColors = useMemo(() => {
    if (theme === 'dark') {
      return {
        grid: '#35557f',
        axis: '#cbdcf7',
        tooltipBg: '#112749',
        tooltipBorder: '#35557f',
        label: '#eaf2ff',
      };
    }

    return {
      grid: '#cbd5e1',
      axis: '#475569',
      tooltipBg: '#ffffff',
      tooltipBorder: '#cfeaff',
      label: '#1e3a5f',
    };
  }, [theme]);

  const legendStyle: CSSProperties = {
    color: chartColors.label,
  };

  if (loading) return <p className="app-muted py-10 text-center">{t('admin.stats.loading')}</p>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="app-surface-strong rounded-2xl border border-l-4 border-l-blue-500 p-6 shadow-md">
          <h3 className="app-muted text-sm font-bold uppercase">{t('admin.stats.registeredClients')}</h3>
          <p className="mt-2 text-4xl font-extrabold text-blue-600">{totalUsuarios}</p>
        </div>

        <div className="app-surface-strong rounded-2xl border border-l-4 border-l-green-500 p-6 shadow-md">
          <h3 className="app-muted text-sm font-bold uppercase">{t('admin.stats.totalProducts')}</h3>
          <p className="mt-2 text-4xl font-extrabold text-green-600">{totalProductos}</p>
        </div>
      </div>

      <div className="app-surface-strong rounded-2xl border p-6 shadow-md">
        <h3 className="mb-6 text-center text-lg font-bold">{t('admin.stats.itemsLast7Days')}</h3>

        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <AreaChart data={datosGrafica} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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

              <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: chartColors.axis }} axisLine={{ stroke: chartColors.grid }} tickLine={{ stroke: chartColors.grid }} />
              <YAxis allowDecimals={false} tick={{ fill: chartColors.axis }} axisLine={{ stroke: chartColors.grid }} tickLine={{ stroke: chartColors.grid }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: chartColors.tooltipBg,
                  borderColor: chartColors.tooltipBorder,
                  borderRadius: '12px',
                  color: chartColors.label,
                }}
                labelStyle={{ color: chartColors.label }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={legendStyle} />

              <Area type="monotone" dataKey="libros" name={t('admin.stats.booksRegistered')} stroke="#8884d8" fillOpacity={1} fill="url(#colorLibros)" isAnimationActive={true} />
              <Area type="monotone" dataKey="videojuegos" name={t('admin.stats.gamesRegistered')} stroke="#82ca9d" fillOpacity={1} fill="url(#colorJuegos)" isAnimationActive={true} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
