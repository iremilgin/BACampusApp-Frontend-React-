import React, { useEffect, useState } from "react";
import "../scss/subject-details.scss";
import "../scss/button.scss";
import { getSubjectById } from "../api/subjectApi";


const SubjectDetails = async ({ subjectId, onClose }) => {
  const [subject, setSubject] = useState(null);
  

  await getSubjectById(subjectId)
      .then((data) => setSubject(data.data))
      .catch((error) => {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Veriler alınırken hata oluştu: ", error)
      }
      );

  if (!subject) {
    return <div>Loading...</div>;
  }
  const handleGoBack = () => {
    onClose();
  };
  return (
    <div className="student-details-container">
      <h1 className="student-details-title">
        {subject.name} {subject.description}
      </h1>
      <div className="student-details-item">
        <span className="student-details-label">Konu Adı:</span>
        <span className="student-details-value">{subject.name}</span>
      </div>
      <div className="student-details-item">
        <span className="student-details-label">Telefon Numarası:</span>
        <span className="student-details-value">{subject.phoneNumber}</span>
      </div>
      <div className="student-details-item">
        <span className="student-details-label">Cinsiyet:</span>
        <span
          className={`student-details-value ${
            subject.gender ? "gender-male" : "gender-female"
          }`}
        >
          {subject.gender ? "Male" : "Female"}
        </span>
      </div>
      <div className="student-details-item">
        <span className="student-details-label">Doğum Tarihi:</span>
        <span className="student-details-value">
          {new Date(subject.dateOfBirth).toLocaleDateString()}
        </span>
      </div>

      <div className="form-buttons">
        <button
          className="go-back-button cancel-button "
          onClick={handleGoBack}
        >
          Listeye Dön
        </button>
      </div>
    </div>
  );
};

export default SubjectDetails;