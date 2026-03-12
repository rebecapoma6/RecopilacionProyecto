import type { ReactNode } from "react";

interface CardHomeProps {
  title: string;
  content: string;
  icon?: ReactNode;
}

export default function CardHome({ title, content, icon }: CardHomeProps) {
  return (
    <article className="app-surface group rounded-3xl border p-6 shadow-[0_14px_30px_rgba(0,63,158,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(47,107,255,0.16)]">
      {icon && (
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary-300 text-primary-700 transition duration-300 group-hover:bg-primary-700 group-hover:text-white">
          {icon}
        </div>
      )}
      <h3 className="mb-3 text-2xl-h3 font-semibold">{title}</h3>
      <p className="app-muted text-lg-subtitle leading-8">{content}</p>
    </article>
  );
}
