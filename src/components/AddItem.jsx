import React, { useRef, useState } from "react";
import { addItem } from "../utils/methods";
import swal from "sweetalert";

function AddItem({ updateData, rosterData, setRosterData }) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Player");
  const [pronoun, setPronoun] = useState("");
  const [isCaptain, setIsCaptain] = useState(false);
  const inputRef = useRef(null);

  const resetInputs = () => {
    setName("");
    setNumber("");
    setRole("");
    setStatus("Player");
    setPronoun("");
    setIsCaptain(false);
  };

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus);

    // Si on passe à "Staff", on désactive la case Captain
    if (selectedStatus === "Staff") {
      setIsCaptain(false); // Réinitialiser la case Captain quand on passe à Staff
      setRole(""); // Réinitialiser le rôle Staff quand on passe à Player
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (name) {
      addItem(
        {
          name: name,
          number: number,
          // photo: photo,
          role: role,
          status: status,
          pronouns: pronoun,
        },
        status === "Player" ? "players" : "staff"
      );
      resetInputs();
      updateData();
      inputRef.current.focus();
    } else {
      swal({
        title: "Warning",
        text: "Please Insert a Derby name",
        icon: "warning",
      });
    }
  };

  return (
    <div className="add-item content-modal flex-column">
      <form onSubmit={handleOnSubmit} data-aos="fade-down">
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Derby name"
        />

        <input
          type="text"
          id="pronoun"
          value={pronoun}
          onChange={(e) => setPronoun(e.target.value)}
          placeholder="Pronoun(s)"
        />
        {/* Liste déroulante pour le type de rôle */}
        <div>
          <label htmlFor="role">Role :</label>
          <select id="role" value={status} onChange={handleStatusChange}>
            <option value="Player">Player</option>
            <option value="Staff">Staff</option>
          </select>
        </div>

        {/* Si Staff est sélectionné, afficher la liste déroulante pour le rôle */}
        {status === "Staff" && (
          <div>
            <label htmlFor="role">Rôle :</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Bench coach">Bench coach</option>
              <option value="Line up Manager">Line up Manager</option>
              <option value="undefined">Do not mention</option>
            </select>
          </div>
        )}
        {/* Si Player est sélectionné, afficher la case à cocher pour "Captain" */}
        {status === "Player" && (
          <div>
            <input
              type="text"
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Number"
            />
            <label>
              <input
                type="checkbox"
                checked={isCaptain}
                onChange={(e) => setIsCaptain(e.target.checked)}
              />
              Captain
            </label>
          </div>
        )}

        <button
          className="add-button "
          data-aos="fade-up"
          data-aos-mirror="true"
        >
          Add {status === "Player" ? "player" : "staff"}
        </button>
      </form>
    </div>
  );
}

export default AddItem;
