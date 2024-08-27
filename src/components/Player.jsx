import React, { useState } from "react";

function Player({ item, printableHeight }) {
  return (
    <div
      className="item template-1"
      style={{ height: `calc(${printableHeight} / 5)` }}
    >
      <div className="item-content">
        <div className="position-container">
          <p>{item.role === "captain" && "C"}</p>
        </div>
        <div className="photo-container"></div>
        <div className="bottom-card">
          <div className="number-container">
            <p>{item.number}</p>
          </div>
          <h2 className="name-content">{item.name}</h2>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Player);
