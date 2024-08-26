import React, { useState } from "react";
import { deleteItem as deleteMethod, updateColor } from "../utils/methods";
import swal from "sweetalert";

function Note({ item: { id, description, color }, updateData }) {
  const [isColorPickerVisible, setVisability] = useState(false);
  const [bgColor, setColor] = useState(color ?? "#52B5D6");
  const deleteItem = () => {
    swal({
      title: "Delete?",
      text: "Are You Sure You Want To Delete This Note",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteMethod(id);
        updateData();
      }
    });
  };
  return (
    <div className="item">
      <div className="item-content">
        <div
          className={`color-picker-container ${
            isColorPickerVisible ? "show" : ""
          }`}
        ></div>
        <div
          className="note"
          style={{ backgroundColor: bgColor }}
          data-aos="zoom-in"
          data-aos-once="true"
        >
          <p className="description">{description}</p>
          <button className="trash-button" onClick={deleteItem}></button>
          <button
            className="color-button"
            onClick={() => {
              setVisability(!isColorPickerVisible);
            }}
          ></button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Note);
