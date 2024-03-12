import React from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import "./Navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();

  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { status, address } = useAccount();

  const handleConnectWallet = async () => {
    if (address) {
      disconnect();
      return;
    }
    await connectAsync({ connector: connectors[0] });
  };

  return (
    <div className="Navbar">
      <div className="NavLeft">
        <img src="/Amoeba.jfif" className="logo" />
        <span onClick={() => navigate("/create")}>Mint</span>
        <span onClick={() => navigate("/collections")}>Collections</span>
      </div>

      <div className="NavRight">
        <button onClick={handleConnectWallet}>
          {status === "connected"
            ? address.slice(0, 4) + "..." + address.slice(38)
            : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
