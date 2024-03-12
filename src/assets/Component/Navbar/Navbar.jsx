import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="Navbar">
      <div className="NavLeft">
        <img src="/Amoeba.jfif" className="logo" />
        <span onClick={() => navigate("/create")}>Create</span>
        <span onClick={() => navigate("/collections")}>Collections</span>
      </div>

      <div className="NavRight">
        <button>Connect Wallet</button>
      </div>
    </div>
  );
};

export default Navbar;
