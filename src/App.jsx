import { useCallback, useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
//import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";

// components
import Player from "./components/Player";
import Sidebar from "./components/Sidebar";
import CustomizeRoster from "./components/CustomizeRoster";
import AddItem from "./components/AddItem";

import { MuuriComponent } from "muuri-react";
import {
  getData,
  updateLocalStorageData,
  muuriLayout,
  muuriLayout2,
  muuriLayout5xHeight,
} from "./utils/methods";
import "./App.scss";

import dataTest from "./test/dataTest";
import dataTestStaff from "./test/dataTestStaff";
//import { display } from "html2canvas/dist/types/css/property-descriptors/display";

function App() {
  // data
  const [dataPlayers, setDataPlayers] = useState(dataTest);
  const [dataStaff, setDataStaff] = useState(dataTestStaff);

  // format
  const printableRef = useRef(null); // Créer une référence au div
  const [printableHeight, setPrintableHeight] = useState(0); // Stocker la hauteur du div
  const [printableWidth, setPrintableWidth] = useState(0);

  // customize roster
  const [format, setFormat] = useState("format-a3");
  const [eventName, setEventName] = useState("Event Name");
  const [teamName, setTeamName] = useState("Team Name");
  const [teamLogo, setTeamLogo] = useState({});
  const [bgImage, setBgImage] = useState();
  const [bgColor, setBgColor] = useState("#ffffff");
  const [rosterData, setRosterData] = useState(getData());

  // Modals
  const [openModal, setOpenModal] = useState();
  const [contentModal, setContentModal] = useState();

  useEffect(() => {
    // Récupérer la hauteur du div après le montage du composant
    updatePrintableDimensions();

    const savedBgImage = localStorage.getItem("uploadedBgImage");
    if (savedBgImage) {
      setRosterData({ ...rosterData, bgImage: savedBgImage });
    }

    // Ajouter l'événement pour écouter les changements de taille de la fenêtre
    window.addEventListener("resize", updatePrintableDimensions);

    // Nettoyage lors du démontage du composant
    return () => {
      window.removeEventListener("resize", updatePrintableDimensions);
    };
  }, [rosterData]);

  // Fonction pour mettre à jour la largeur de la div
  const updatePrintableDimensions = () => {
    if (printableRef.current) {
      setPrintableHeight(printableRef.current.clientWidth * 1.4142);
      setPrintableWidth(printableRef.current.clientWidth);
    }
  };

  const updateData = useCallback(() => {
    setRosterData(getData());
  }, []);

  const reorderPlayer = (newItemsOrder, data, type) => {
    const items = newItemsOrder
      .map((item) => item._component.key)
      .map((id) => data.find((obj) => obj.id === +id));
    //console.log("items >", items);

    let updateItems = {};
    type === "players"
      ? (updateItems = { ...rosterData, players: items })
      : (updateItems = { ...rosterData, staff: items });
    updateLocalStorageData(updateItems);
  };

  const orderPlayers = (array) => {
    return array.sort((a, b) => {
      // Convertir les nombres en chaînes pour comparaison caractère par caractère
      const numA = a.number.toString();
      const numB = b.number.toString();

      // Comparer les chaînes caractère par caractère
      for (let i = 0; i < Math.max(numA.length, numB.length); i++) {
        const digitA = numA[i] ? parseInt(numA[i]) : -1; // Prendre le chiffre, ou -1 s'il n'existe pas
        const digitB = numB[i] ? parseInt(numB[i]) : -1; // Prendre le chiffre, ou -1 s'il n'existe pas

        if (digitA !== digitB) {
          return digitA - digitB; // Comparer les chiffres
        }
      }

      // Si tous les chiffres sont égaux, garder l'ordre original
      return 0;
    });
  };

  const orderStaff = ({ items }) => {
    // Reverse the array without mutating the original
    const reversedItems = [...items].reverse();
    return reversedItems;
  };

  const handleExportPDF = () => {
    const element = printableRef.current;

    if (element) {
      // Obtenir la largeur et la hauteur de l'élément
      const elementWidth = element.offsetWidth;
      const elementHeight = element.offsetHeight + 2;
      //console.log("element dimensions", elementWidth, elementHeight);

      // Convertir les dimensions en points (1 pt = 1/72 inch)
      const pdfWidth = elementWidth * 0.75; // 1 pixel = 0.75 point
      const pdfHeight = elementHeight * 0.75;

      const doc = new jsPDF({
        orientation: elementWidth > elementHeight ? "landscape" : "portrait",
        unit: "pt",
        format: [elementWidth, elementHeight],
      });

      const timestamp = new Date()
        .toISOString()
        .replace(/[-:]/g, "-")
        .replace(/[T]/g, "_")
        .split(".")[0];
      const filename = `roster_${eventName}_${teamName}_${timestamp}.pdf`;

      // Utilise la méthode html() pour exporter tout en gardant le HTML comme structure
      doc.html(element, {
        callback: function (doc) {
          // Une fois le contenu ajouté, le PDF est téléchargé
          doc.save(filename);
        },
        x: 0,
        y: 0,
        html2canvas: {
          scale: 1, // Pas de redimensionnement
          useCORS: true, // Gérer les problèmes de même origine avec les images externes
          windowWidth: elementWidth, // Éviter les masques en définissant la largeur de la fenêtre
          logging: false, // Désactiver le log pour éviter les erreurs inutiles
        },
        //autoPaging: "text",
        width: element.offsetWidth, // Garde la largeur originale de l'élément
        height: element.offsetHeight, // Garde la hauteur originale de l'élément
      });
    } else {
      console.error("Element is not defined or componentRef.current is null");
    }
  };

  const handleExportFlatPDF = async () => {
    const element = printableRef.current;

    if (element) {
      // Utiliser html2canvas pour capturer une capture d'écran de l'élément
      const canvas = await html2canvas(element, {
        scale: 2, // Pour une meilleure résolution
        useCORS: true, // Prend en charge les images provenant de domaines externes
        logging: false,
      });

      // Obtenir les dimensions du canvas
      const imgData = canvas.toDataURL("image/png", 0.9);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Convertir les dimensions du canvas en points pour jsPDF (1 pt = 1/72 inch)
      const pdfWidth = imgWidth * 0.75;
      const pdfHeight = imgHeight * 0.75;

      // Créer un nouveau PDF
      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
        unit: "pt",
        format: [pdfWidth, pdfHeight], // Utiliser les dimensions de l'image
      });

      // Ajouter l'image dans le PDF (l'image couvre toute la page)
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

      // Télécharger le PDF aplati
      pdf.save("roster-exported-html2canvas.pdf");
    }
  };

  const handleExportJPEG = async () => {
    const element = printableRef.current;

    if (element) {
      try {
        // Capture the element using html2canvas
        const canvas = await html2canvas(element, {
          scale: 2, // Improve resolution
          useCORS: true, // Handle cross-origin images
          logging: false,
        });

        // Convert canvas to JPEG data URL
        const imgData = canvas.toDataURL("image/jpeg", 0.9);

        // Create a timestamp for the filename
        const timestamp = new Date()
          .toISOString()
          .replace(/[-:]/g, "-")
          .replace(/[T]/g, "_")
          .split(".")[0];
        const filename = `roster_${eventName}_${teamName}_${timestamp}.jpg`;

        // Create a Blob object from the data URL
        const blob = await fetch(imgData).then((res) => res.blob());
        const url = URL.createObjectURL(blob);

        // Trigger download manually
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link); // Ensure it's part of the DOM for the click to work
        link.click();
        document.body.removeChild(link); // Clean up DOM after download

        // Revoke the object URL to free memory
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error exporting JPEG:", error);
      }
    } else {
      console.error("Target element not found for export.");
    }
  };

  return (
    <>
      <Sidebar
        setOpenModal={setOpenModal}
        setContentModal={setContentModal}
        openModal={openModal}
        handleExportPDF={handleExportPDF}
        handleExportJPEG={handleExportJPEG}
        setRosterData={setRosterData}
        rosterData={rosterData}
        updateData={updateData}
        updateLocalStorageData={updateLocalStorageData}
      />
      <div className="container-main">
        {/* <AddItem updateParentData={updateData} /> */}
        {/* Begin modal */}
        {/* <div className={`modal-container ${openModal}`}>
          <div
            className="overlay modal-trigger"
            onClick={() => {
              setOpenModal("");
              setContentModal("");
            }}
          ></div>
          <div className="modal">
            <button
              className="close-modal modal-trigger"
              onClick={() => {
                setOpenModal("");
                setContentModal("");
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            {contentModal === "customize" && (
              <CustomizeRoster
                setRosterData={setRosterData}
                rosterData={rosterData}
                updateData={updateData}
                updateLocalStorageData={updateLocalStorageData}
              />
            )}
            {contentModal === "add" && (
              <AddItem
                setRosterData={setRosterData}
                rosterData={rosterData}
                updateData={updateData}
              />
            )}
          </div>
        </div> */}
        {/* End modal */}

        <main className={`printable-contener ${rosterData.format}`}>
          <div
            ref={printableRef}
            className={`printable template-1`}
            style={{
              // height: printableHeight,
              backgroundImage: `url(${rosterData.bgImage})`,
              backgroundColor: rosterData.bgColor,
              color: rosterData.textColor,
            }}
          >
            <div className="top-roster">
              {rosterData.displayLogo && (
                <div className="logo-team-container">
                  <img
                    src={rosterData.teamLogo}
                    alt={`${rosterData.teamName} logo`}
                  />
                </div>
              )}

              <div className="text-container">
                <h2 className="event-name">{rosterData.eventName}</h2>
                <h3 className="team-name">{rosterData.teamName}</h3>
              </div>
            </div>

            <MuuriComponent
              dragEnabled
              id={"PLAYERS"}
              layout={muuriLayout}
              onDragEnd={(e) => {
                reorder(e.getGrid().getItems(), rosterData.players, "players");
                //console.log("onDrag", e.getGrid().getItems());
              }}
            >
              {rosterData.players &&
                rosterData.players.map((item, index) => (
                  <Player
                    id={item.id}
                    key={item.id}
                    {...{ item, updateData, printableHeight }}
                    index={index}
                  />
                ))}
            </MuuriComponent>
            <MuuriComponent
              dragEnabled
              id={"STAFF"}
              layout={(grid, layoutId, items, width, height, callback) => {
                muuriLayout2(grid, layoutId, items, width, height, callback);
              }}
              onDragEnd={(e) => {
                reorder(e.getGrid().getItems(), rosterData.staff, "staff");
              }}
            >
              {rosterData.staff &&
                rosterData.staff.map((item, index) => (
                  <Player
                    id={item.id}
                    key={item.id}
                    {...{ item, updateData, printableHeight }}
                    index={index}
                  />
                ))}
            </MuuriComponent>
            {/* {!dataPlayers.length && !dataStaff.length && (
            <p data-aos="zoom-in" className="empty-list-pragraph">
              No Player To Show
            </p>
          )} */}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
