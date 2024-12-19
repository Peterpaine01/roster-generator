import Muuri from "muuri";

const gridRef = useRef(null);

useEffect(() => {
  // Ensure the grid DOM element exists
  const gridElement = gridRef.current;
  if (!gridElement) return;

  // Initialize Muuri grid
  const grid = new Muuri(gridElement, {
    dragEnabled: true,
    layoutOnInit: false,
  });

  // Load layout from localStorage if it exists
  const savedLayout = window.localStorage.getItem("layout");
  if (savedLayout) {
    loadLayout(grid, savedLayout);
  } else {
    grid.layout(true);
  }

  // Save layout on move
  grid.on("move", () => saveLayout(grid));

  // Cleanup function to destroy the grid on component unmount
  return () => {
    grid.destroy();
  };
}, []); // Empty dependency array to run effect only once

// Helper functions
const serializeLayout = (grid) => {
  const itemIds = grid
    .getItems()
    .map((item) => item.getElement().getAttribute("data-id"));
  return JSON.stringify(itemIds);
};

const saveLayout = (grid) => {
  const layout = serializeLayout(grid);
  window.localStorage.setItem("layout", layout);
};

const loadLayout = (grid, serializedLayout) => {
  const layout = JSON.parse(serializedLayout);
  const currentItems = grid.getItems();
  const currentItemIds = currentItems.map((item) =>
    item.getElement().getAttribute("data-id")
  );
  const newItems = [];
  let itemId;
  let itemIndex;

  for (let i = 0; i < layout.length; i++) {
    itemId = layout[i];
    itemIndex = currentItemIds.indexOf(itemId);
    if (itemIndex > -1) {
      newItems.push(currentItems[itemIndex]);
    }
  }

  grid.sort(newItems, { layout: "instant" });
  grid.layout();
};

{
  /* <div className="grid" ref={gridRef}>
              <div
                class="item"
                data-id="1"
                style={{ height: `calc(${printableHeight} / 5)` }}
              >
                <div class="item-content">1</div>
              </div>
              <div
                class="item"
                data-id="2"
                style={{ height: `calc(${printableHeight} / 5)` }}
              >
                <div class="item-content">2</div>
              </div>
              <div
                class="item"
                data-id="3"
                style={{ height: `calc(${printableHeight} / 5)` }}
              >
                <div class="item-content">3</div>
              </div>
              <div
                class="item"
                data-id="4"
                style={{ height: `calc(${printableHeight} / 5)` }}
              >
                <div class="item-content">4</div>
              </div>
              <div
                class="item"
                data-id="5"
                style={{ height: `calc(${printableHeight} / 5)` }}
              >
                <div class="item-content">5</div>
              </div>
              <div
                class="item"
                data-id="6"
                style={{ height: `calc(${printableHeight} / 5)` }}
              >
                <div class="item-content">6</div>
              </div>
              {/* {rosterData.players &&
                rosterData.players.map((item, index) => {
                  return (
                    <Player
                      id={item.id}
                      key={item.id}
                      {...{ item, updateData, printableHeight }}
                      index={index}
                    />
                  );
                })} }
            </div> */
}
