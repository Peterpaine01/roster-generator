import React, { useState } from "react";

function Sidebar({ setOpenModal, openModal, setContentModal }) {
  const [isOpen, setIsOpen] = useState("close");

  // Fonction pour gérer le clic sur le bouton
  const handleButtonClick = (event) => {
    event.preventDefault();
    setIsOpen(isOpen === "open" ? "close" : "open");
  };

  //console.log("openModal >", openModal);
  return (
    <div className={`sidebar ${isOpen} fixed`}>
      <div className="top-sidebar relative">
        <a href="" className="btn-open absolute" onClick={handleButtonClick}>
          <i className="fa-solid fa-chevron-right"></i>
        </a>
        <h1>
          <i>
            <img
              src="https://res.cloudinary.com/djxejhaxr/image/upload/v1726660214/easy-roster/logo-easy-rider-mono-w_m3zrjl.svg"
              alt=""
            />
          </i>

          <span>
            <strong>Easy</strong> Roster
          </span>
        </h1>
      </div>

      <div className="navbar-container flex-column">
        <a
          href=""
          className="btn-menu"
          onClick={(event) => {
            event.preventDefault();
            setOpenModal(openModal !== "active" ? "active" : "");
            setContentModal("customize");
          }}
        >
          <i className="fa-solid fa-brush"></i>
          <span>customize the roster</span>
        </a>
        <a
          href=""
          className="btn-menu"
          onClick={(event) => {
            event.preventDefault();
            setOpenModal(openModal !== "active" ? "active" : "");
            setContentModal("add");
          }}
        >
          <i className="fa-solid fa-user-plus"></i>
          <span>add a player</span>
        </a>
        <a href="" className="btn-menu">
          <i className="fa-solid fa-eye"></i>
          <span>preview roster</span>
        </a>
        <a href="" className="btn-menu">
          <i className="fa-solid fa-file-export"></i>
          <span>export roster</span>
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
