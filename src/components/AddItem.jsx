import React, { useRef, useState } from "react";
import { addItem } from "../utils/methods";
import swal from "sweetalert";

function AddItem({ updateParentData }) {
  const [description, setDescription] = useState("");
  const inputRef = useRef(null);

  const resetInputs = () => {
    setDescription("");
  };

  const submitAction = (e) => {
    e.preventDefault();
    if (description.trim()) {
      addItem({
        description: description.trim(),
      });
      resetInputs();
      updateParentData();
      inputRef.current.focus();
    } else {
      swal({
        title: "Warning",
        text: "Please Insert Title And Description",
        icon: "warning",
      });
    }
  };

  return (
    <div className="add-item">
      <form onSubmit={submitAction} data-aos="fade-down">
        <textarea
          ref={inputRef}
          type="text"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          placeholder="Write Your Name ..."
        />

        <button
          className="add-button "
          data-aos="fade-up"
          data-aos-mirror="true"
        >
          Add Item
        </button>
      </form>
    </div>
  );
}

export default AddItem;
