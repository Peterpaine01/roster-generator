import { useCallback, useState, useEffect, useRef } from "react";

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
} from "./utils/methods";
import "./App.scss";

import dataTest from "./test/dataTest";
import dataTestStaff from "./test/dataTestStaff";

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
  }, []);

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

  const reorder = (newItemsOrder, data, type) => {
    const items = newItemsOrder
      .map((item) => item._component.key)
      .map((id) => data.find((obj) => obj.id === +id));
    console.log("items >", items);

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

  const handleDelete = () => {
    localStorage.removeItem("rosterData");
    updateData();
    alert("Data reseted !");
  };

  //console.log("rosterData >", rosterData);
  console.log("height >", printableHeight);
  console.log("printableWidth >", printableWidth);

  return (
    <>
      <Sidebar
        setOpenModal={setOpenModal}
        setContentModal={setContentModal}
        openModal={openModal}
      />
      <div className="container-main">
        {/* <AddItem updateParentData={updateData} /> */}
        {/* Begin modal */}
        <div className={`modal-container ${openModal}`}>
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
        </div>
        {/* End modal */}
        <button onClick={handleDelete}>Reset data</button>
        <main
          ref={printableRef}
          className={`printable ${rosterData.format} template-1`}
          style={{
            height: printableHeight,
            backgroundImage: `url(${rosterData.bgImage})`,
            backgroundColor: rosterData.bgColor,
            color: rosterData.textColor,
          }}
        >
          <div className="top-roster">
            <div className="logo-team-container">
              <img
                src={rosterData.teamLogo}
                alt={`${rosterData.teamName} logo`}
              />
            </div>
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
            layout={muuriLayout2}
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
        </main>
      </div>
    </>
  );
}

export default App;
