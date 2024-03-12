import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="Navbar">
      <img src="/Amoeba.jfif" className="logo" />
      
    </div>
  );
};

export default Navbar;
