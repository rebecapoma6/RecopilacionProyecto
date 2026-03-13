import { useState, type ChangeEvent, type FocusEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "./Select";
import InputField from "./InputField";
import Button from "./Button";
import { validateField } from "../../utils/regex";
import type { Product } from "../../interfaces/Products";
import { SupabaseProductRepository } from "../../database/supabase/SupabaseProductRepository";
import ImageInput from "./ImageInput";
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";

interface DatosFormularioProps {
  tipo: string;
  titulo: string;
  autor: string;
  genero: string;
  fecha_fin: string;
  puntuacion: number;
  reseña: string;
  imagen: string;
  imagen_file?: File;
}

interface ErrorsProps {
  tipo: string;
  titulo: string;
  autor: string;
  genero: string;
  fecha_fin: string;
  puntuacion: string;
  reseña: string;
  imagen: string;
}

interface AgregarItemsProps {
  initialData?: Product;
}

export default function AgregarItems({ initialData }: AgregarItemsProps) {
  const { t } = useTranslation();
  const repository = new SupabaseProductRepository();
  const navigate = useNavigate();
  const location = useLocation();
  const productToEdit: Product | undefined = initialData || location.state?.product;

  const [datosFormulario, setDatosFormulario] = useState<DatosFormularioProps>({
    tipo: productToEdit?.tipo || "",
    titulo: productToEdit?.titulo || "",
    autor: productToEdit?.autor || "",
    genero: productToEdit?.genero || "",
    fecha_fin: productToEdit?.fecha_fin?.toString() || "",
    puntuacion: productToEdit?.puntuacion || 0,
    reseña: productToEdit?.resena || "",
    imagen: productToEdit?.imagen_url || "",
  });

  const [errors, setErrors] = useState<ErrorsProps>({ tipo: "", titulo: "", autor: "", genero: "", fecha_fin: "", puntuacion: "", reseña: "", imagen: "" });

const opcionesGenero = [
  { value: "", label: 'products.genres.select' },
  { value: "fantasía", label: 'products.genres.fantasia' },
  { value: "terror", label: 'products.genres.terror' },
  { value: "ciencia-ficción", label: 'products.genres.cienciaFiccion' }, // Coincide con 'cienciaFiccion'
  { value: "novelanegra", label: 'products.genres.novelaNegra' },       // Coincide con 'novelaNegra'
  { value: "ensayo", label: 'products.genres.ensayo' },
  { value: "poesia", label: 'products.genres.poesia' },
  { value: "shooter", label: 'products.genres.shooter' },
  { value: "rpg", label: 'products.genres.rpg' },
  { value: "survaival", label: 'products.genres.survival' },          // Coincide con 'survival'
  { value: "estrategia", label: 'products.genres.estrategia' },
  { value: "lucha", label: 'products.genres.lucha' },
  { value: "battleroyale", label: 'products.genres.battleRoyale' },    // Coincide con 'battleRoyale'
];

  const opcionesTipo = [
    { value: "", label: t('products.types.select') },
    { value: "libro", label: t('products.types.book') },
    { value: "videojuego", label: t('products.types.game') },
  ];

  const handleImage = (file: File) => {
    setDatosFormulario((prev) => ({ ...prev, imagen_file: file }));
    setErrors((prev) => ({ ...prev, imagen: "" }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      tipo: validateField("tipo", datosFormulario.tipo),
      titulo: validateField("titulo", datosFormulario.titulo),
      autor: validateField("autor", datosFormulario.autor),
      genero: validateField("genero", datosFormulario.genero),
      fecha_fin: validateField("fecha_fin", datosFormulario.fecha_fin),
      puntuacion: validateField("puntuacion", datosFormulario.puntuacion.toString()),
      reseña: validateField("reseña", datosFormulario.reseña),
      imagen: validateField("imagen", datosFormulario.imagen),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    if (productToEdit) {
      const { error } = await repository.updateProduct({
        ...productToEdit,
        titulo: datosFormulario.titulo,
        resena: datosFormulario.reseña,
        imagen_url: datosFormulario.imagen,
        imagen_file: datosFormulario.imagen_file,
        tipo: datosFormulario.tipo,
        genero: datosFormulario.genero,
        autor: datosFormulario.autor,
        fecha_fin: new Date(datosFormulario.fecha_fin),
        puntuacion: datosFormulario.puntuacion,
      });

      if (error) {
        toast.error(t('products.form.updateError'));
        console.error(error);
        return;
      }

      toast.success(t('products.form.updateSuccess'));
    } else {
      const { error } = await repository.createProduct({
        titulo: datosFormulario.titulo,
        resena: datosFormulario.reseña,
        imagen_url: datosFormulario.imagen,
        imagen_file: datosFormulario.imagen_file,
        tipo: datosFormulario.tipo,
        genero: datosFormulario.genero,
        autor: datosFormulario.autor,
        fecha_fin: new Date(datosFormulario.fecha_fin),
        puntuacion: datosFormulario.puntuacion,
        id: null,
      });

      if (error) {
        toast.error(t('products.form.createError'));
        console.error(error);
        return;
      }

      toast.success(t('products.form.createSuccess'));
    }

    navigate('/products');
  };

  return (
    <div>
      <div className="mb-6 text-left">
        <p className="app-muted mt-1 text-sm">{t('products.form.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select name="tipo" label="Tipo" value={datosFormulario.tipo} options={opcionesTipo} onChange={handleChange} onBlur={handleBlur} />
        {errors.tipo && <p className="text-sm text-red-500">{errors.tipo}</p>}

        <InputField label={t('products.form.titleLabel')} placeholder={t('products.form.titlePlaceholder')} name="titulo" type="text" value={datosFormulario.titulo} onChange={handleChange} onBlur={handleBlur} error={errors.titulo} />
        <InputField label={t('products.form.authorLabel')} placeholder={t('products.form.authorPlaceholder')} name="autor" type="text" value={datosFormulario.autor} onChange={handleChange} onBlur={handleBlur} error={errors.autor} />

        <Select 
  name="genero" 
  label={t('products.form.genreLabel')} 
  value={datosFormulario.genero} 
  // Traducimos el label de cada opción al vuelo
  options={opcionesGenero.map(opt => ({ 
    ...opt, 
    label: t(opt.label) 
  }))} 
  onChange={handleChange} 
  onBlur={handleBlur} 
/>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label={t('products.form.endDateLabel')} name="fecha_fin" type="date" value={datosFormulario.fecha_fin} onChange={handleChange} onBlur={handleBlur} error={errors.fecha_fin} />
          <InputField label={t('products.form.ratingLabel')} name="puntuacion" type="number" value={datosFormulario.puntuacion} onChange={handleChange} onBlur={handleBlur} error={errors.puntuacion} />
        </div>

        <InputField label={t('products.form.reviewLabel')} name="reseña" type="text" value={datosFormulario.reseña} onChange={handleChange} onBlur={handleBlur} error={errors.reseña} />

        <div className="app-surface rounded-2xl border p-4">
          <p className="mb-3 text-sm font-medium">{t('products.form.imageTitle')}</p>
          <ImageInput name="ImagenProducto" defaultImageUrl={datosFormulario.imagen} onFileSelect={handleImage} />
        </div>

        <div className="flex flex-col gap-3 pt-3 sm:flex-row">
          <Button type="button" onClick={() => navigate('/products')} variant="secondary" className="w-full">{t('common.cancel')}</Button>
          <Button type="submit" className="w-full">{productToEdit ? t('common.update') : t('common.save')}</Button>
        </div>
      </form>
    </div>
  );
}
