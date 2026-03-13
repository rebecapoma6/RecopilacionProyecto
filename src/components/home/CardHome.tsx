import type { ReactNode } from 'react';

interface CardHomeProps {
  title: string;
  content: string;
  icon?: ReactNode;
}

export default function CardHome({ title, content, icon }: CardHomeProps) {
  return (
    <article className="app-surface rounded-3xl border p-6 shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-300 text-primary-700 transition-colors duration-200 hover:bg-primary-400">
          {icon}
        </div>
      )}

      <h3 className="mb-3 text-2xl-h3 font-semibold">{title}</h3>
      <p className="app-muted text-lg-subtitle leading-8">{content}</p>
    </article>
  );
}
