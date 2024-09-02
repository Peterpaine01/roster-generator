import React, { useState } from "react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState("close");

  // Fonction pour gérer le clic sur le bouton
  const handleButtonClick = (event) => {
    event.preventDefault();
    setIsOpen(isOpen === "open" ? "close" : "open");
  };

  console.log("open >", isOpen);
  return (
    <div className={`sidebar ${isOpen} fixed`}>
      <div className="top-sidebar relative">
        <a href="" className="btn-open absolute" onClick={handleButtonClick}>
          <i class="fa-solid fa-chevron-right"></i>
        </a>
        <h1>
          <i class="fa-solid fa-rotate-left"></i>
          <span>Roster generator</span>
        </h1>
      </div>

      <div className="navbar-container flex-column">
        <a href="" className="btn-menu">
          <i className="fa-solid fa-brush"></i>
          <span>customize the roster</span>
        </a>
        <a href="" className="btn-menu">
          <i className="fa-solid fa-user-plus"></i>
          <span>add a player</span>
        </a>
        <a href="" className="btn-menu">
          <i className="fa-solid fa-eye"></i>
          <span>preview roster</span>
        </a>
        <a href="" className="btn-menu">
          <i class="fa-solid fa-file-export"></i>
          <span>export roster</span>
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
