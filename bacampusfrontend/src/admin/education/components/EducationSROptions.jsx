import React, { useEffect } from "react";
import {useParams } from "react-router-dom";
import "../scss/education-sr-options.scss";

const EducationSROptions = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Eğitim Kaynakları</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      <div className="education-sr-container">
        <div className="education-sr-card">
          <a href={`../../education/educationsupplamentaryresourcedocumentarylist/${id}`}
          >
            <h2>DOKÜMANLAR</h2>
            <img
              src={require("../img/baAkademi.jpg")}
              alt="resim"
              className="img-bgAkademi"
            />
          </a>
          <div>
          </div>
        </div>
        <div className="education-sr-card">
          <a href={`../../education/educationsupplamentaryresourcevideolist/${id}`}>
          <h2>VİDEOLAR</h2>
          <img
            src={require("../img/baAkademi.jpg")}
            alt="resim"
            className="img-bgAkademi"
          />
          </a>
          <div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationSROptions;
