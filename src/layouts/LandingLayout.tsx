import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

export default function LandingLayout() {
  return (
    <div className="landing-layout">
      <Navbar /> 
      <main>
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}