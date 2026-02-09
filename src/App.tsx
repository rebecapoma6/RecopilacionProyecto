import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
// import Products from './pages/';
import SignInPage from './pages/singInPage';
import Registro from './components/form/Registro';
// import ProductosSupabase from './pages/ProductosSupabase';
//import RecuperarPass from './pages/RecuperarPass';
import AgregarItems from './pages/AgregarItems';
import './App.css';
import PageRecuperarPass from './pages/PageRecuperarPass';

function App() {
  return (
    <div className="app-container flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/products" element={<Products />} /> */}
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/registro" element={<Registro />} />
          {/* <Route path="/productos-supabase" element={<ProductosSupabase />} /> */}
          {/* <Route path="/recuperar-pass" element={<RecuperarPass />} /> */}
          <Route path="/agregar-items" element={<AgregarItems />} />
          <Route path="/recuperarPass" element={<PageRecuperarPass/>} />
  
        </Routes>
      </main>
      <div className="footer-container">
        <Footer />
      </div>
    </div>
  );
}

export default App;