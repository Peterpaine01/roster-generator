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
  const [teamLogo, setTeamLogo] = useState(
    rosterData.teamLogo ||
      "https://res.cloudinary.com/djxejhaxr/image/upload/v1726572044/easy-roster/logo-easy-rider-r_glyrwq.svg"
  );
  const [displayLogo, setDisplayLogo] = useState(
    rosterData.displayLogo || true
  );
  const [bgImage, setBgImage] = useState(rosterData.bgImage || "");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [displayPronouns, setDisplayPronouns] = useState(
    rosterData.displayPronouns || true
  );
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

  console.log("eventName >", eventName);

  const handleSubmit = (event) => {
    event.preventDefault();
    let updateInfos = {
      ...rosterData,
      eventName: eventName,
      teamName: teamName,
      teamLogo: teamLogo,
      displayLogo: displayLogo,
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
    <div className="flex-column">
      <form className="customize" onSubmit={handleSubmit}>
        <div className="block-group">
          {/* Nom de l'événement */}
          <div className="block-input">
            <input
              type="text"
              name="eventName"
              placeholder={rosterData.eventName}
              value={eventName}
              onChange={(event) => {
                setEventName(event.target.value);
              }}
            />
          </div>
          {/* Nom de l'équipe */}
          <div className="block-input">
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
          <hr />
          {/* Ajout logo équipe */}
          <div className="block-input">
            <p>Team logo</p>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleImageUpload(event, "teamLogo")}
            />
            {teamLogo && (
              <div className="block-input-row">
                <img
                  src={teamLogo}
                  alt="Uploaded"
                  style={{ width: "50px", marginTop: "10px" }}
                />
                <br />
                <button
                  onClick={(event) => handleRemoveImage(event, "teamLogo")}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="block-input-row checkbox-wrapper-24">
            <input
              type="checkbox"
              id="displayLogo"
              name="check"
              checked={displayLogo}
              onChange={(e) => setDisplayLogo(e.target.checked)}
            />
            <label htmlFor="displayLogo">
              <span></span>Display logo
            </label>
          </div>
        </div>
        <div className="block-group">
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

          {/* Liste déroulante Template */}
          <div className="block-input">
            <label htmlFor="template">Template :</label>
            <select
              id="template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              <option value="default">Default</option>
            </select>
          </div>
        </div>
        <div className="block-group">
          {/* Color picker pour le texte */}
          <div className="block-input-row">
            <label htmlFor="textColor">Text color</label>
            <input
              type="color"
              id="textColor"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            />
          </div>

          {/* Color picker pour le background */}
          <div className="block-input-row">
            <label htmlFor="bgColor">Background color</label>
            <input
              type="color"
              id="bgColor"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
          </div>
          {/* Ajout image de fond */}
          <div className="block-input">
            <p>Background image</p>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleImageUpload(event, "bgImage")}
            />
            {bgImage && (
              <div className="block-input-row">
                <img
                  src={bgImage}
                  alt="Uploaded"
                  style={{ width: "50px", marginTop: "10px" }}
                />
                <br />
                <button
                  onClick={(event) => handleRemoveImage(event, "bgImage")}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Switch pour afficher les pronoms */}
        <div className="block-group">
          <h4>Inclusivité</h4>

          <div className="block-input-row checkbox-wrapper-24">
            <input
              type="checkbox"
              name="check"
              id="displayPronouns"
              checked={displayPronouns}
              onChange={(e) => setDisplayPronouns(e.target.checked)}
            />
            <label htmlFor="displayPronouns">
              <span></span>Display pronouns
            </label>
          </div>
        </div>

        <div className="submit-block">
          <input className="btn-solid" type="submit" value="Save changes" />
        </div>
      </form>
    </div>
  );
}

export default CustomizeRoster;
