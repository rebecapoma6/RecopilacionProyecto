 export const validateField = (name: string, value: string) => {
    switch (name) {
      case "nombre":
        if (!value.trim()) return "El nombre es obligatorio";
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value))
          return "Solo se permiten letras y espacios";
        return "";
      case "edad":
        if (!value) return "La edad es obligatoria";
        if (Number(value) <= 0) return "Debe ser mayor que 0";
        return "";
      case "contrasenia":
        if (value.length < 6) return "Mínimo 6 caracteres";
        return "";
      default:
        return "";
    }
  };