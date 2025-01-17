import React, { useState } from "react";
import CustomizeRoster from "./CustomizeRoster";

function Sidebar({
  setOpenModal,
  openModal,
  setContentModal,
  handleExportPDF,
  handleExportFlatPDF,
  handleExportJPEG,
  setRosterData,
  rosterData,
  updateData,
  updateLocalStorageData,
}) {
  const [isOpen, setIsOpen] = useState("close");
  const [openCustomize, setOpenCustomize] = useState(false);

  // Fonction pour gérer le clic sur le bouton
  const handleButtonClick = (event) => {
    event.preventDefault();
    setIsOpen(isOpen === "open" ? "close" : "open");
    const customBlocks = document.querySelectorAll(".open");
    customBlocks.forEach((block) => {
      block.classList.remove("open");
      block.classList.add("close");
    });
  };

  // Fonction pour vider cache
  const handleDelete = () => {
    localStorage.removeItem("rosterData");
    updateData();
    alert("Data reseted !");
  };

  //console.log("openModal >", openModal);
  return (
    <div className={`sidebar ${isOpen} fixed`}>
      <a className="btn-open absolute" onClick={handleButtonClick}>
        <i className="fa-solid fa-chevron-right"></i>
      </a>
      <div className="top-sidebar relative">
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
          className="btn-menu"
          onClick={(event) => {
            event.preventDefault();

            // Récupérer l'élément cliqué
            const clickedElement = event.currentTarget;

            // Récupérer la div située juste après l'élément cliqué
            const nextElement = clickedElement.nextElementSibling;

            setOpenCustomize(openCustomize ? false : true);

            // Supprimer la classe "close" et ajouter la classe "open" à la div suivante
            nextElement.classList.remove("close");
            nextElement.classList.add("open");

            if (nextElement) {
              if (isOpen === "open") {
                setOpenCustomize(openCustomize ? false : true);
              } else if (isOpen === "close") {
                setIsOpen("open");
                setOpenCustomize(true);

                // Supprimer la classe "close" et ajouter la classe "open" à la div suivante
                nextElement.classList.remove("close");
                nextElement.classList.add("open");
              }
            }
          }}
        >
          <i className="fa-solid fa-brush"></i>
          <span>customize roster</span>
        </a>
        <div className={openCustomize ? "open" : "close"}>
          <CustomizeRoster
            setRosterData={setRosterData}
            rosterData={rosterData}
            updateData={updateData}
            updateLocalStorageData={updateLocalStorageData}
          />
        </div>

        <a
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
        <button className="btn-menu" onClick={handleExportJPEG}>
          <i className="fa-solid fa-file-export"></i>
          <span>export roster</span>
        </button>
        <button className="btn-menu" onClick={handleDelete}>
          Reset data
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
