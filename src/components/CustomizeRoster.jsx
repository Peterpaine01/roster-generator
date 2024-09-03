import React, { useRef, useState, useEffect } from "react";
import { addItem } from "../utils/methods";

function CustomizeRoster({ setRosterData, rosterData }) {
  const [image, setImage] = useState(null);
  const [format, setFormat] = useState("format-a3");
  const [eventName, setEventName] = useState("Event Name");
  const [teamName, setTeamName] = useState("Team Name");
  const [teamLogo, setTeamLogo] = useState({});
  const [bgImage, setBgImage] = useState();
  const [bgColor, setBgColor] = useState("#ffffff");

  useEffect(() => {
    // Load the image from localStorage when the component mounts
    const savedBgImage = localStorage.getItem("uploadedBgImage");
    if (savedBgImage) {
      setBgImage(savedBgImage);
    }
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    setRosterData((prevObjet) => ({
      ...rosterData,
      bgImage: bgImage,
      eventName: eventName,
    }));
    console.log(rosterData);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setBgImage(base64String);
        //localStorage.setItem("uploadedImage", base64String);
      };
      reader.readAsDataURL(file); // Convert the file to base64 string
    }
  };

  const handleRemoveImage = () => {
    setBgImage(null);

    localStorage.removeItem("uploadedBgImage");
  };
  console.log("form >", eventName, bgImage);
  return (
    <div>
      <form
        action=""
        onSubmit={handleSubmit}
        className="content-modal flex-column"
      >
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
        </div>
        <div className="block-input">
          <p>Background image</p>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {bgImage && (
            <div>
              <img
                src={bgImage}
                alt="Uploaded"
                style={{ width: "50px", marginTop: "10px" }}
              />
              <br />
              <button onClick={handleRemoveImage}>Remove Image</button>
            </div>
          )}
        </div>
        <div className="submit-block">
          <input className="btn-solid" type="submit" value="Save" />
        </div>
      </form>
    </div>
  );
}

export default CustomizeRoster;
