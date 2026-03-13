import { useTranslation } from "react-i18next";
import EstadisticasDashboard from "../components/admin/EstadisticasDashboard";

export default function EstadisticasPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
      <h1 className="mb-2 text-2xl font-bold">{t('admin.stats.title')}</h1>
      <p className="app-muted mb-8">{t('admin.stats.description')}</p>
      <EstadisticasDashboard />
    </div>
  );
}
