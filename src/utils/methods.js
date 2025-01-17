export const getData = () => {
  const dataStored = localStorage.getItem("rosterData");
  const data = {
    eventName: "Event Name",
    teamName: "Team Name",
    teamLogo:
      "https://res.cloudinary.com/djxejhaxr/image/upload/v1726572044/easy-roster/logo-easy-rider-r_glyrwq.svg",
    displayLogo: true,
    format: "format-a3",
    template: "default",
    color: "#000",
    bgImage: "",
    bgColor: "#ffffff",
    displayPronouns: true,
    players: [
      {
        name: "player 1",
        number: "01",
        photo: {},
        role: "captain",
        status: "player",
        pronouns: "elle",
        id: 0,
      },
      {
        name: "player 2",
        number: "11",
        photo: {},
        role: "",
        status: "player",
        pronouns: "ael",
        id: 1,
      },
      {
        name: "player 3",
        number: "015",
        photo: {},
        role: "",
        status: "player",
        pronouns: "il",
        id: 2,
      },
      {
        name: "player 4",
        number: "69",
        photo: {},
        role: "",
        status: "player",
        pronouns: "elle",
        id: 3,
      },
      {
        name: "player 5",
        number: "48",
        photo: {},
        role: "",
        status: "player",
        pronouns: "elle",
        id: 4,
      },
      {
        name: "player 6",
        number: "333",
        photo: {},
        role: "",
        status: "player",
        pronouns: "elle",
        id: 5,
      },
      {
        name: "player 7",
        number: "299",
        photo: {},
        role: "",
        status: "player",
        pronouns: "il",
        id: 6,
      },
      {
        name: "player 8",
        number: "25",
        photo: {},
        role: "",
        status: "player",
        pronouns: "il",
        id: 7,
      },
      {
        name: "player 9",
        number: "9999",
        photo: {},
        role: "",
        status: "player",
        pronouns: "elle",
        id: 8,
      },
      {
        name: "player 10",
        number: "1999",
        photo: {},
        role: "",
        status: "player",
        pronouns: "elle",
        id: 9,
      },
      {
        name: "player 11",
        number: "42",
        photo: {},
        role: "",
        status: "player",
        pronouns: "elle",
        id: 10,
      },
      {
        name: "player 12",
        number: "21",
        photo: {},
        role: "",
        status: "player",
        pronouns: "elle",
        id: 11,
      },
      {
        name: "player 13",
        number: "55",
        photo: {},
        role: "captain",
        status: "player",
        pronouns: "elle",
        id: 12,
      },
      {
        name: "player 14",
        number: "39",
        photo: {},
        role: "",
        status: "player",
        pronouns: "elle",
        id: 13,
      },
      {
        name: "player 15",
        number: "55",
        photo: {},
        role: "captain",
        status: "player",
        pronouns: "elle",
        id: 14,
      },
      {
        name: "player 16",
        number: "39",
        photo: {},
        role: "",
        status: "player",
        pronouns: "elle",
        id: 15,
      },
      {
        name: "player 17",
        number: "39",
        photo: {},
        role: "",
        status: "player",
        pronouns: "elle",
        id: 16,
      },
      {
        name: "player 17",
        number: "39",
        photo: {},
        role: "",
        status: "player",
        pronouns: "elle",
        id: 17,
      },
      {
        name: "player 18",
        number: "39",
        photo: {},
        role: "",
        status: "player",
        pronouns: "elle",
        id: 18,
      },
    ],
    staff: [
      {
        name: "Bench",
        number: "",
        photo: {},
        role: "bench",
        status: "staff",
        pronouns: "elle",
        id: 0,
      },
      {
        name: "Line up",
        number: "",
        photo: {},
        role: "line up",
        status: "staff",
        pronouns: "elle",
        id: 0,
      },
    ],
  };
  //console.log("dataStored >", JSON.parse(dataStored));

  return dataStored && dataStored !== "undefined"
    ? JSON.parse(dataStored)
    : data;
  //return data;
};

export const updateLocalStorageData = (data) => {
  localStorage.setItem("rosterData", JSON.stringify(data));
};

export const addItem = (item, type) => {
  let data = getData();
  console.log("data >", data);
  console.log("data players >", data[type]);

  item.id = data[type].reduce((a, obj) => (a > obj.id ? a : obj.id), 0) + 1;
  data[type].push(item);
  updateLocalStorageData(data);
  console.log(
    "local storage after update >",
    JSON.parse(localStorage.getItem("rosterData"))
  );
};

export const deleteItem = (id, type) => {
  let data = getData();
  data = data[type].filter((item) => item.id !== id);
  updateLocalStorageData(data);
};

export const updateColor = (id, newColor) => {
  const data = getData();
  const item = data.find((item) => item.id === id);
  item.color = newColor;
  updateLocalStorageData(data);
};

export const muuriLayout5xHeight = (
  grid,
  layoutId,
  items,
  width,
  height,
  callback
) => {
  const layout = {
    id: layoutId,
    items: items,
    slots: [],
    styles: {},
  };

  let item;
  let m;
  let x = 0;
  let y = 0;
  let w = 0;
  let h = 0;

  let totalHeight = 0; // Variable pour la hauteur totale
  let itemHeightWithMargins = 0; // Hauteur de chaque item avec ses marges

  // Calculer la hauteur d'un item avec les marges
  if (items.length > 0) {
    item = items[0];
    m = item.getMargin();
    itemHeightWithMargins = item.getHeight() - m.top;
  }

  // Définir la hauteur totale de la grille à 5 fois la hauteur d'un item
  totalHeight = itemHeightWithMargins * 5;

  let currentW = 0;
  let currentRowH = 0;

  for (let i = 0; i < items.length; i++) {
    item = items[i];

    m = item.getMargin();
    w = item.getWidth() + m.left + m.right;
    h = item.getHeight() + m.top + m.bottom;

    x += w; // Ajouter la largeur des éléments

    if (h > currentRowH) {
      currentRowH = h; // Mettre à jour la hauteur de la ligne
    }

    currentW += w;

    // Si la ligne atteint la largeur maximale, passer à la ligne suivante
    if (currentW >= width) {
      y += currentRowH;
      currentRowH = 0;
      x = 0;
      currentW = 0;
    }

    layout.slots.push(x, y);
  }

  // Ajuster la hauteur de la grille en fonction de la hauteur totale désirée
  layout.styles.width = "100%";
  layout.styles.height = totalHeight + "px"; // Définir la hauteur totale de la grille

  // Appliquer le layout et appeler le callback
  callback(layout);
};

export const muuriLayout = (grid, layoutId, items, width, height, callback) => {
  const layout = {
    id: layoutId,
    items: items,
    slots: [],
    styles: {},
  };

  let item;
  let m;
  let x = 0;
  let y = 0;
  let w = 0;
  let h = 0;

  let totalHeight = 0; // Variable pour la hauteur totale
  let itemHeightWithMargins = 0; // Hauteur de chaque item avec ses marges

  // Calculer la hauteur d'un item avec les marges
  if (items.length > 0) {
    item = items[0];
    m = item.getMargin();
    itemHeightWithMargins = item.getHeight() - m.top;
  }

  // Définir la hauteur totale de la grille à 5 fois la hauteur d'un item
  totalHeight = itemHeightWithMargins * 5;

  let maxW = width / 2;
  let currentW = 0;
  let currentRowH = 0;
  let currentRowW = 0;
  let rowSizes = [];
  let rowFixes = [];

  let xPre, yPre, wPre, hPre;
  let numToFix = 0;

  for (let i = 0; i < items.length; i++) {
    item = items[i];

    m = item.getMargin();
    wPre = item.getWidth() + m.left + m.right;

    hPre = item.getHeight() + m.top + m.bottom;
    xPre += wPre;

    if (hPre > currentRowH) {
      currentRowH = hPre;
    }

    if (w < currentRowW) {
      currentRowW = wPre;
    }

    rowSizes.push(width / 2);
    numToFix++;
    currentW += wPre;

    let k = 0;

    for (let j = 0; j < numToFix; j++) {
      rowSizes[i - j] -= wPre / 2;
    }

    if (numToFix > 1) {
      rowSizes[i] -= (wPre / 2) * (numToFix - 1);
      k += wPre / 2;
    }

    currentW -= k;
    rowFixes.push(k);

    if (currentW >= maxW) {
      yPre += currentRowH;
      currentRowH = 0;
      xPre = 0;
      numToFix -= 1;
      currentW = 0;
      numToFix = 0;
      k = 0;
    }
  }

  maxW = width / 2;
  currentW = 0;
  currentRowH = 0;
  currentRowW = 0;

  for (let i = 0; i < items.length; i++) {
    item = items[i];
    x += w;

    if (h > currentRowH) {
      currentRowH = h;
    }

    if (w < currentRowW) {
      currentRowW = w;
    }

    currentW += w - rowFixes[i];

    if (currentW >= maxW) {
      y += currentRowH;
      currentRowH = 0;
      x = 0;
      currentW = 0;
    }
    m = item.getMargin();
    w = item.getWidth() + m.left + m.right;
    h = item.getHeight() + m.top + m.bottom;

    layout.slots.push(x, y);
  }

  const layoutH = currentRowH * 4;

  layout.styles.width = "100%";
  layout.styles.height = y + currentRowH + "px";
  // layout.styles.height = layoutH + "px";
  // layout.styles.height = totalHeight + "px"; // Définir la hauteur totale de la grille
  callback(layout);
};

// export const muuriLayout2 = (
//   grid,
//   layoutId,
//   items,
//   width,
//   height,
//   callback
// ) => {
//   const layout = {
//     id: layoutId,
//     items: items,
//     slots: [],
//     styles: {},
//   };

//   let item;
//   let m;
//   let x = width; // Initialiser x à la largeur maximale (pour commencer à droite)
//   let y = 0;
//   let w = 0;
//   let h = 0;

//   let maxW = width / 2;
//   let currentW = 0;
//   let currentRowH = 0;
//   let currentRowW = 0;
//   let rowSizes = [];
//   let rowFixes = [];

//   let xPre, yPre, wPre, hPre;
//   let numToFix = 0;

//   for (let i = 0; i < items.length; i++) {
//     item = items[i];

//     m = item.getMargin();
//     wPre = item.getWidth() + m.left + m.right;

//     hPre = item.getHeight() + m.top + m.bottom;
//     xPre -= wPre; // Décrémenter xPre pour placer les éléments de droite à gauche

//     if (hPre > currentRowH) {
//       currentRowH = hPre;
//     }

//     if (w < currentRowW) {
//       currentRowW = wPre;
//     }

//     rowSizes.push(width / 2);
//     numToFix++;
//     currentW += wPre;

//     let k = 0;

//     for (let j = 0; j < numToFix; j++) {
//       rowSizes[i - j] -= wPre / 2;
//     }

//     if (numToFix > 1) {
//       rowSizes[i] -= (wPre / 2) * (numToFix - 1);
//       k += wPre / 2;
//     }

//     currentW -= k;
//     rowFixes.push(k);

//     if (currentW >= maxW) {
//       yPre += currentRowH;
//       currentRowH = 0;
//       xPre = width; // Réinitialiser xPre à la largeur du conteneur pour chaque nouvelle ligne
//       numToFix -= 1;
//       currentW = 0;
//       numToFix = 0;
//       k = 0;
//     }
//   }

//   maxW = width / 2;
//   currentW = 0;
//   currentRowH = 0;
//   currentRowW = 0;

//   let conteneurW;

//   for (let i = 0; i < items.length; i++) {
//     item = items[i];
//     x -= w; // Décrémenter x pour placer les éléments de droite à gauche

//     if (h > currentRowH) {
//       currentRowH = h;
//     }

//     if (w < currentRowW) {
//       currentRowW = w;
//     }

//     currentW += w - rowFixes[i];

//     if (currentW >= maxW) {
//       y += currentRowH;
//       currentRowH = 0;
//       x = width; // Réinitialiser x à la largeur du conteneur
//       currentW = 0;
//     }
//     m = item.getMargin();
//     w = item.getWidth() + m.left + m.right - 2;
//     h = item.getHeight() + m.top + m.bottom;
//     conteneurW = (item.getWidth() + m.left + m.right - 2) * 5;

//     layout.slots.push(x, y);
//   }

//   layout.styles.width = conteneurW + "px";
//   layout.styles.height = y + h + 1 + "px";
//   callback(layout);
// };

export const muuriLayout2 = (
  grid,
  layoutId,
  items,
  width,
  height,
  callback
) => {
  const layout = {
    id: layoutId,
    items: items,
    slots: [],
    styles: {},
  };

  let item;
  let m;
  let x = width; // x will be set after calculating the width of the first item
  let y = 0;
  let w = 0;
  let h = 0;

  let maxW = width / 2;
  let currentW = 0;
  let currentRowH = 0;
  let currentRowW = 0;
  let rowSizes = [];
  let rowFixes = [];

  let conteneurW;

  // Iterate through items to set the layout
  for (let i = 0; i < items.length; i++) {
    item = items[i];
    m = item.getMargin();
    w = item.getWidth() + m.left + m.right;
    h = item.getHeight() + m.top + m.bottom;

    // For the first item, set x to (container width - item width)
    if (i === 0) {
      x = width - w - 5;
    } else {
      x -= w; // For other items, decrement x
    }

    // If we overflow the current row, reset x and adjust y
    if (currentW + w > width) {
      x = width - w;
      y += currentRowH;
      currentRowH = 0;
      currentW = 0;
    }

    // Update the row's current height
    if (h > currentRowH) {
      currentRowH = h;
    }

    currentW += w;
    layout.slots.push(x, y);
  }

  layout.styles.width = width + "px"; // Set the container width
  layout.styles.height = y + currentRowH + "px"; // Set the container height
  callback(layout);
};
