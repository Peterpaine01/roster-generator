export const getData = () => {
  return JSON.parse(localStorage.getItem("items")) || [];
};

export const updateLocalStorageData = (dataList) => {
  localStorage.setItem("items", JSON.stringify(dataList));
};

export const addItem = (item) => {
  let data = getData();
  item.id = data.reduce((a, obj) => (a > obj.id ? a : obj.id), 0) + 1;
  data.push(item);
  updateLocalStorageData(data);
};

export const deleteItem = (id) => {
  let data = getData();
  data = data.filter((item) => item.id !== id);
  updateLocalStorageData(data);
};

export const updateColor = (id, newColor) => {
  const data = getData();
  const item = data.find((item) => item.id === id);
  item.color = newColor;
  updateLocalStorageData(data);
};

export const muuriLayout = (grid, layoutId, items, width, height, callback) => {
  var layout = {
    id: layoutId,
    items: items,
    slots: [],
    styles: {},
  };

  var item;
  var m;
  var x = 0;
  var y = 0;
  var w = 0;
  var h = 0;

  var maxW = width / 2;
  var currentW = 0;
  var currentRowH = 0;
  var currentRowW = 0;
  var rowSizes = [];
  var rowFixes = [];

  var xPre, yPre, wPre, hPre;
  var numToFix = 0;

  for (var i = 0; i < items.length; i++) {
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

    var k = 0;

    for (var j = 0; j < numToFix; j++) {
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

  for (var i = 0; i < items.length; i++) {
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
    layout.slots.push(x + rowSizes[i], y);
  }

  layout.styles.width = "100%";
  layout.styles.height = y + h + 1 + "px";

  callback(layout);
};
