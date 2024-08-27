import { useCallback, useState, useEffect, useRef } from "react";
import AddItem from "./components/AddItem";
import Note from "./components/Note";
import Player from "./components/Player";
import { MuuriComponent } from "muuri-react";
import { getData, updateLocalStorageData, muuriLayout } from "./utils/methods";
import "./App.scss";

import dataTest from "./test/dataTest";

function App() {
  const [data, setData] = useState(dataTest);
  const [format, setFormat] = useState("format-a3");

  const printableRef = useRef(null); // Créer une référence au div

  const [printableHeight, setPrintableHeight] = useState(0); // Stocker la hauteur du div

  useEffect(() => {
    // Récupérer la hauteur du div après le montage du composant
    if (printableRef.current) {
      setPrintableHeight(printableRef.current.clientHeight);
    }
  }, []);

  const updateData = useCallback(() => {
    setData(getData());
  }, []);

  const reorder = (newItemsOrder) => {
    const items = newItemsOrder
      .map((item) => item._component.key)
      .map((id) => data.find((obj) => obj.id === +id));
    setData(items);
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
  console.log("orderPlayers >", orderPlayers(data));

  return (
    <div className="container">
      <header>
        <h1>Roster generator</h1>
      </header>

      {/* <AddItem updateParentData={updateData} /> */}

      <main className={`printable ${format}`}>
        <div className="top-roster">
          <h2 className="event-name">Event Name</h2>
          <div className="team-container">
            <h3 className="team-name">Team name</h3>
            <div className="logo-team-container">
              <p>X</p>
            </div>
          </div>
        </div>

        <MuuriComponent
          ref={printableRef}
          className={`printable ${format}`}
          dragEnabled
          layout={muuriLayout}
          onDragEnd={(e) => {
            reorder(e.getGrid().getItems());
          }}
        >
          {orderPlayers(data).map((item, index) => (
            <Player
              id={item.id}
              key={item.id}
              {...{ item, updateData, printableHeight }}
              index={index}
            />
          ))}
        </MuuriComponent>
        {!!!data.length && (
          <p data-aos="zoom-in" className="empty-list-pragraph">
            No Notes To Show
          </p>
        )}
      </main>
    </div>
  );
}

export default App;
