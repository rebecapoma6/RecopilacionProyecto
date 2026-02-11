import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
// import Products from './pages/';
import Registro from './components/form/Registro';
// import ProductosSupabase from './pages/ProductosSupabase';
//import RecuperarPass from './pages/RecuperarPass';
import AgregarItems from './pages/AgregarItemsPage';
import './App.css';
import PageRecuperarPass from './pages/RecuperarPassPage';
import IniciarSesionPage from './pages/IniciarSesionPage';
import HomePage from './pages/HomePage';
import AgregarItemsPage from './pages/AgregarItemsPage';
import PageRecuperarPassPage from './pages/RecuperarPassPage';
import RegistroPage from './pages/RegistroPage';
import ProductosSupabase from './pages/ProductosSupabase';

function App() {
  return (
    <div className="app-container flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/*<Route path="/profile" element={<PerfilUsuarioPage />} />*/}
          <Route path="/products" element={<ProductosSupabase />} />
          <Route path="/iniciarSesion" element={<IniciarSesionPage />} />
          <Route path="/registro" element={<RegistroPage />} />
          {/* <Route path="/productos-supabase" element={<ProductosSupabase />} /> */}
          {/* <Route path="/recuperar-pass" element={<RecuperarPass />} /> */}
          <Route path="/agregar-items" element={<AgregarItemsPage />} />
          <Route path="/recuperarPass" element={<PageRecuperarPassPage/>} />
  
        </Routes>
      </main>
      <div className="footer-container">
        <Footer />
      </div>
    </div>
  );
}

export default App;