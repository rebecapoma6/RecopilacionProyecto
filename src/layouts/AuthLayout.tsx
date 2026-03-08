import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="auth-layout" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f4f4f4' 
    }}>
      <div className="auth-card" style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
      }}>
        <Outlet /> {/* Aquí se cargarán IniciarSesionPage o RegistroPage */}
      </div>
    </div>
  );
}