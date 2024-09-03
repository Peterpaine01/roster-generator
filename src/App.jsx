import { useCallback, useState, useEffect, useRef } from "react";

// components
import Player from "./components/Player";
import Sidebar from "./components/Sidebar";
import CustomizeRoster from "./components/CustomizeRoster";

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
  const [rosterData, setRosterData] = useState({
    eventName: "Event Name",
    teamName: "Team Name",
    teamLogo: {},
    format: "format-a3",
    bgImage: "",
    bgColor: "#ffffff",
  });

  // Modals
  const [openModal, setOpenModal] = useState();
  const [contentModal, setContentModal] = useState();

  useEffect(() => {
    // Récupérer la hauteur du div après le montage du composant
    if (printableRef.current) {
      setPrintableHeight(printableRef.current.clientHeight);
      setPrintableWidth(printableRef.current.clientWidth);
    }
  }, []);

  const updateData = useCallback(() => {
    setDataPlayers(getData());
  }, []);

  const updateDataStaff = useCallback(() => {
    setDataStaff(getData());
  }, []);

  const reorder = (newItemsOrder, data) => {
    const items = newItemsOrder
      .map((item) => item._component.key)
      .map((id) => data.find((obj) => obj.id === +id));
    if (data === dataPlayers) {
      setDataPlayers(items);
    } else {
      setDataStaff(items);
    }

    updateLocalStorageData(items);
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
  //console.log("orderPlayers >", orderPlayers(data));

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
              />
            )}
          </div>
        </div>
        {/* End modal */}
        <main
          className={`printable ${format} template-1`}
          style={{ height: `calc(${printableWidth} * (1/ 1.141))` }}
        >
          <div className="top-roster">
            <h2 className="event-name">{eventName}</h2>
            <div className="team-container">
              <h3 className="team-name">{teamName}</h3>
              <div className="logo-team-container">
                <p>X</p>
              </div>
            </div>
          </div>

          <MuuriComponent
            ref={printableRef}
            dragEnabled
            id={"PLAYERS"}
            layout={muuriLayout}
            onDragEnd={(e) => {
              reorder(e.getGrid().getItems(), dataPlayers);
            }}
          >
            {orderPlayers(dataPlayers)
              .filter((el) => el.status === "player")
              .map((item, index) => (
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
              reorder(e.getGrid().getItems(), dataStaff);
            }}
          >
            {dataStaff
              .filter((el) => el.status !== "player")
              .map((item, index) => (
                <Player
                  id={item.id}
                  key={item.id}
                  {...{ item, updateDataStaff, printableHeight }}
                  index={index}
                />
              ))}
          </MuuriComponent>
          {!dataPlayers.length && !dataStaff.length && (
            <p data-aos="zoom-in" className="empty-list-pragraph">
              No Player To Show
            </p>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
