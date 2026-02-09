import Button from '../form/Button';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string; 
}

export default function ProductCard({ title, description, price, image }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
      {image && <img src={image} alt={title} className="w-full h-40 object-cover mb-4 rounded" />}
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-2">{description}</p>
      <p className="text-blue-500 font-semibold mb-4">${price.toFixed(2)}</p>
      <Button>Añadir al Carrito</Button>
    </div>
  );
}