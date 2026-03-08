// import { Routes, Route } from 'react-router-dom';
// import Navbar from './components/navbar/Navbar';
// import Footer from './components/footer/Footer';
// // import Products from './pages/';
// import Registro from './components/form/Registro';
// // import ProductosSupabase from './pages/ProductosSupabase';
// //import RecuperarPass from './pages/RecuperarPass';
// import AgregarItems from './pages/AgregarItemsPage';
// import './App.css';
// import PageRecuperarPass from './pages/RecuperarPassPage';
// import IniciarSesionPage from './pages/IniciarSesionPage';
// import HomePage from './pages/HomePage';
// import AgregarItemsPage from './pages/AgregarItemsPage';
// import PageRecuperarPassPage from './pages/RecuperarPassPage';
// import RegistroPage from './pages/RegistroPage';
// import ProductosSupabase from './pages/ProductosSupabase';

// function App() {
//   return (
//     <div className="app-container flex flex-col min-h-screen">
//       <Navbar />
//       <main className="grow">
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           {/*<Route path="/profile" element={<PerfilUsuarioPage />} />*/}
//           <Route path="/products" element={<ProductosSupabase />} />
//           <Route path="/iniciarSesion" element={<IniciarSesionPage />} />
//           <Route path="/registro" element={<RegistroPage />} />
//           {/* <Route path="/productos-supabase" element={<ProductosSupabase />} /> */}
//           {/* <Route path="/recuperar-pass" element={<RecuperarPass />} /> */}
//           <Route path="/agregar-items" element={<AgregarItemsPage />} />
//           <Route path="/recuperarPass" element={<PageRecuperarPassPage/>} />
  
//         </Routes>
//       </main>
//       <div className="footer-container">
//         <Footer />
//       </div>
//     </div>
//   );
// }

// export default App;


import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LandingLayout from './layouts/LandingLayout';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';

//Nuestras páginas actuales
import HomePage from './pages/HomePage';
import IniciarSesionPage from './pages/IniciarSesionPage';
import RegistroPage from './pages/RegistroPage';
import ProductosSupabase from './pages/ProductosSupabase';
//import AgregarItemsPage from "./pages/AgregarItemsPage";
import PageRecuperarPassPage from './pages/RecuperarPassPage';
import ModificarDatosPage from "./pages/ModificarDatosPage";


import PerfilUsuarioPage from './pages/PerfilUsuarioPage'; 

import ProtectedRoute from "./router/ProtectedRoute";
import PublicRoute from "./router/PublicRoute";
import AdminPage from "./pages/AdminPage";
import AdminRoute from "./router/AdminRoute";
import AgregarItemsPage from "./pages/AgregarItemsPage";
import EstadisticasPage from "./pages/EstadisticasPage";


const router = createBrowserRouter([
  {
    element: <LandingLayout />, //esta sera como ruta la pública general
    children: [
      { path: "/", element: <HomePage /> },
    ],
  },

   {
    element: <PublicRoute />, // esto sera las rutas para usuarios NO logueados
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/iniciarSesion", element: <IniciarSesionPage/> },
          { path: "/registro", element: <RegistroPage/> },
          { path: "/recuperarPass", element: <PageRecuperarPassPage/>},
        ]
      }
    ]
  },

   {
    element: <ProtectedRoute />, // Solo para usuarios AUTENTICADOS
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/products", element: <ProductosSupabase/> },
          { path: "/modificar-datos", element: <ModificarDatosPage/>},
          { path: "/perfil", element: <PerfilUsuarioPage/>} 
        ]
      }
    ]
  },

  {
    element: <AdminRoute />, // Solo para Administradores
    children: [
      {
        element: <AppLayout />, 
        children: [
          { path: "/vistaAdmin", element: <AdminPage/>},
          { path: "/estadisticas", element: <EstadisticasPage/> }
        ]
      }
    ]
  }

])

function App(){
  return <RouterProvider router={router} />;
}

export default App;