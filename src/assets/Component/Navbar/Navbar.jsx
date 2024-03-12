import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="Navbar">
      <div className="NavLeft">
        <img src="/Amoeba.jfif" alt="Logo" className="logo" />
        <h1 className="Name">Amoeba</h1>
        <div className="Pages">
          <span onClick={navigate("/create")}>Create</span>
          <span onClick={navigate("/collections")}>Collections</span>
        </div>
      </div>
      {/* <div className="NavRight">
        <div className="ConnectWalletBtn">Connect Wallet</div>
      </div> */}
    </div>
  );
};

export default Navbar;
