import Footer from "../components/footer/Footer";
import IniciarSesion from "../components/form/IniciarSesion";
import Navbar from "../components/navbar/Navbar";

export default function IniciarSesionPage(){

  return(
    <>
    <Navbar></Navbar>
      <IniciarSesion></IniciarSesion>
    <Footer></Footer>
    </>
  )
}