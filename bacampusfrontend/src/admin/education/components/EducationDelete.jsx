import React from "react";
import "../scss/education-delete.scss";

const EducationDelete = () => {
  return (
    <div>
      <div className="header">
        <h1>Eğitimler</h1>
        <img className="line" src={require("../../../assets/img/substract.png")} alt="" />
      </div>
      <div className="main-form">
        <div className="education-create-card">
          <div className="education-create-card-header">
            <h2>Eğitim Sil</h2>
          </div>
          <div className="education-create-card-body">
            <h2>Öğeyi silmek istediğinize emin misiniz?</h2>
          </div>
          <div className="education-delete-card-footer">
            <button className="btn btn-danger-1">Evet</button>
            <button className="btn btn-success-1">İptal</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationDelete;
