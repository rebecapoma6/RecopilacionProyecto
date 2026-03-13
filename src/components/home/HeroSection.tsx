﻿import { useNavigate } from "react-router-dom";
import Button from "../form/Button";
import { useAuthStore } from "../../store/useAuthStore";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <section className="flex justify-center px-4 pb-8 pt-10 text-center md:px-6 md:pb-12 md:pt-16">
      <div className="w-full max-w-5xl">
        <h1 className="mx-auto max-w-4xl text-4xl-h1 font-semibold leading-tight md:text-[4rem] md:leading-[1.05]">
          {t('home.hero.title')}
        </h1>
        <p className="app-muted mx-auto mt-6 max-w-3xl text-lg-subtitle leading-8 md:text-[2rem] md:leading-[1.4]">
          {t('home.hero.subtitle')}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            type="button"
            onClick={() => navigate(isAuthenticated ? "/products" : "/registro")}
            className="min-w-52 px-8 py-3 text-base"
          >
            {t('home.hero.start')}
          </Button>
          
        </div>
      </div>
    </section>
  );
}
