import { useCallback, useState } from "react";
import AddItem from "./components/AddItem";
import Note from "./components/Note";
import Player from "./components/Player";
import { MuuriComponent } from "muuri-react";
import { getData, updateLocalStorageData, muuriLayout } from "./utils/methods";
import "./App.scss";

import dataTest from "./test/dataTest";

function App() {
  const [data, setData] = useState(dataTest);

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

  console.log(data);

  return (
    <div className="App">
      <h1 data-aos="fade-up">Roster generator</h1>
      {/* <AddItem updateParentData={updateData} /> */}

      <main id="printable">
        <MuuriComponent
          dragEnabled
          layout={muuriLayout}
          onDragEnd={(e) => {
            reorder(e.getGrid().getItems());
          }}
        >
          {data.map((item, index) => (
            <Player
              id={item.id}
              key={item.id}
              {...{ item, updateData }}
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
