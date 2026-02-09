interface CardHomeProps {
  title: string;
  content: string;
  icon?: string; // esto puede ser opcional por que un no sabemos si le podremos iconos o no a las cards de inicio
}

export default function CardHome({ title, content, icon }: CardHomeProps) {
  return (
    <div className="border rounded-lg p-6 bg-white shadow-md hover:shadow-lg transition">
      {icon && <div className="text-3xl mb-2">{icon}</div>}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  );
}