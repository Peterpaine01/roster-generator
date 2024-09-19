import React, { useRef, useState, useEffect } from "react";
import { addItem } from "../utils/methods";

function CustomizeRoster({
  setRosterData,
  rosterData,
  updateData,
  updateLocalStorageData,
}) {
  const [format, setFormat] = useState("format-a3");
  const [eventName, setEventName] = useState(rosterData.eventName);
  const [teamName, setTeamName] = useState(rosterData.teamName);
  const [teamLogo, setTeamLogo] = useState(rosterData.teamLogo || "");
  const [bgImage, setBgImage] = useState(rosterData.bgImage || "");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [displayPronouns, setDisplayPronouns] = useState(false);
  const [template, setTemplate] = useState("default");
  const [textColor, setTextColor] = useState("#000000");

  useEffect(() => {
    // Load the image from localStorage when the component mounts
    const savedBgImage = localStorage.getItem("uploadedBgImage");
    if (savedBgImage) {
      setBgImage(savedBgImage);
    }

    const savedTeamImage = localStorage.getItem("uploadedTeamImage");
    if (savedTeamImage) {
      setTeamLogo(savedTeamImage);
    }
  }, []);

  //console.log("teamLogo >", teamLogo);

  const handleSubmit = (event) => {
    event.preventDefault();
    let updateInfos = {
      ...rosterData,
      eventName: eventName,
      teamName: teamName,
      teamLogo: teamLogo,
      bgImage: bgImage,
      bgColor: bgColor,
      displayPronouns: displayPronouns,
      template: template,
      textColor: textColor,
    };
    updateLocalStorageData(updateInfos);
    updateData();
  };

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        if (type === "bgImage") {
          setBgImage(base64String);
          localStorage.setItem("uploadedBgImage", base64String);
        }
        if (type === "teamLogo") {
          setTeamLogo(base64String);
          localStorage.setItem("uploadedTeamImage", base64String);
        }
      };
      reader.readAsDataURL(file); // Convert the file to base64 string
    }
  };

  const handleRemoveImage = (event, type) => {
    if (type === "bgImage") {
      setBgImage(null);
      localStorage.removeItem("uploadedBgImage");
    }
    if (type === "teamLogo") {
      setTeamLogo(null);
      localStorage.removeItem("uploadedTeamImage");
    }
  };

  return (
    <div className="content-modal flex-column">
      <form action="" onSubmit={handleSubmit}>
        <div className="block-input">
          <p>Event Name</p>
          <input
            type="text"
            name="eventName"
            placeholder={rosterData.eventName}
            value={eventName}
            onChange={(event) => {
              setEventName(event.target.value);
            }}
          />
          <p>Team Name</p>
          <input
            type="text"
            name="teamName"
            placeholder={rosterData.teamName}
            value={teamName}
            onChange={(event) => {
              setTeamName(event.target.value);
            }}
          />
        </div>
        {/* Liste déroulante Format */}
        <div className="block-input">
          <label htmlFor="format">Format :</label>
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="format-a3">Affiche A3</option>
            <option value="live-stream">Live Youtube</option>
          </select>
        </div>
        <div className="block-input">
          <p>Background image</p>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => handleImageUpload(event, "bgImage")}
          />
          {bgImage && (
            <div>
              <img
                src={bgImage}
                alt="Uploaded"
                style={{ width: "50px", marginTop: "10px" }}
              />
              <br />
              <button onClick={(event) => handleRemoveImage(event, "bgImage")}>
                Remove Image
              </button>
            </div>
          )}
        </div>
        <div className="block-input">
          <p>Team logo</p>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => handleImageUpload(event, "teamLogo")}
          />
          {teamLogo && (
            <div>
              <img
                src={teamLogo}
                alt="Uploaded"
                style={{ width: "50px", marginTop: "10px" }}
              />
              <br />
              <button onClick={(event) => handleRemoveImage(event, "teamLogo")}>
                Remove Image
              </button>
            </div>
          )}
        </div>
        {/* Liste déroulante Template */}
        <div>
          <label htmlFor="template">Template :</label>
          <select
            id="template"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          >
            <option value="default">Default</option>
          </select>
        </div>

        {/* Color picker pour le texte */}
        <div>
          <label htmlFor="textColor">Color text :</label>
          <input
            type="color"
            id="textColor"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
        </div>

        {/* Color picker pour le background */}
        <div>
          <label htmlFor="bgColor">Background color :</label>
          <input
            type="color"
            id="bgColor"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </div>

        {/* Switch pour afficher les pronoms */}
        <div>
          <label htmlFor="displayPronouns">Display pronouns :</label>
          <input
            type="checkbox"
            id="displayPronouns"
            checked={displayPronouns}
            onChange={(e) => setDisplayPronouns(e.target.checked)}
          />
        </div>
        <div className="submit-block">
          <input className="btn-solid" type="submit" value="Save" />
        </div>
      </form>
    </div>
  );
}

export default CustomizeRoster;
