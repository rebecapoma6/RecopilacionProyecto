import Button from '../form/Button';
import type { Product } from '../../interfaces/Products';
import { SupabaseProductRepository } from '../../database/supabase/SupabaseProductRepository';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';


interface ProductCardProps {
  product: Product;
  onDelete?: (id: number) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const repository = new SupabaseProductRepository();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleUpdate = async () => {
    navigate("/agregar-items", { state: { product } });
  };

  const handleDelete = async () => {
const title = product.titulo ?? t('common.notAvailable');
    const confirmar = window.confirm(t('products.card.deleteConfirm', { title }));    if (confirmar) {
      const { error } = await repository.deleteProduct(product.id_registro);
      if (error) {
toast.error(t('products.card.deleteError'));
        console.error(error);
      } else if (onDelete) {
        onDelete(product.id_registro);
      }
    }
  };

  return (
    <div className="app-surface-strong rounded-3xl border p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
      {product.imagen_url && (
        <img src={product.imagen_url} alt={t('products.card.imageAlt', { title: product.titulo ?? t('common.notAvailable') })} className="mb-4 h-44 w-full rounded-2xl object-cover" />
      )}
      <h2 className="mb-2 text-xl font-bold">{product.titulo}</h2>
      <p className="app-muted mb-2">{t('products.card.review')}: {product.resena || t('common.notAvailable')}</p>
      <p className="app-muted mb-2 text-sm">{t('products.card.type')}: {(product.tipo)}</p>
      <p className="app-muted mb-2 text-sm">{t('products.card.author')}: {product.autor || t('common.notAvailable')}</p>
      <p className="app-muted mb-4 text-sm">{t('products.card.endDate')}: {product.fecha_fin ? new Date(product.fecha_fin).toLocaleDateString(undefined) : t('common.notAvailable')}</p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={handleDelete} className="w-full !bg-red-500 text-white hover:!bg-red-600">{t('common.delete')}</Button>
        <Button onClick={handleUpdate} className="w-full bg-blue-500 text-white hover:bg-blue-600">{t('common.edit')}</Button>
      </div>
    </div>
  );
}
