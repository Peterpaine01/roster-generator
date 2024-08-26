import React, { useState } from "react";

function Player({ item }) {
  return (
    <div className="item template-1">
      <div className="item-content">
        <div className="role-player">
          <p>{item.role === "captain" && "C"}</p>
        </div>
        <div className="photo-player"></div>
        <div className="bottom-card">
          <div className="number-player">
            <p>{item.number}</p>
          </div>
          <h2 className="name-player">{item.name}</h2>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Player);
