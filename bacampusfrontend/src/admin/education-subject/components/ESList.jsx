import React, { useEffect, useState } from "react";
import "../scss/eslist.scss";
import { useParams, useNavigate } from "react-router-dom";
let savedData = sessionStorage.getItem("savedData");
if (sessionStorage.getItem("savedData") != null) {
  savedData = sessionStorage.getItem("savedData").split(",");
  const role = savedData[1];
}
const itemsPerPage = 10;
const EducationSubjectList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [educationDetails, setEducationDetails] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleManageClick = () => {
    navigate(`../educationsubjectmanagement/${id}`);
  };
  useEffect(() => {
    if (!id) {
      return;
    }
    fetch(
      `https://localhost:7247/api/Admin/EducationSubject/ListByEducationtId?educationId=${id}`,
      {
        mode: "cors",
        headers: {
          Authorization: "Bearer " + savedData[0],
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          setEducationDetails(data.data);
          setTotalPages(Math.ceil(data.data.length / itemsPerPage));
        }
      })
      .catch((error) => {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, [id]);

  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const displayedEducationDetails = educationDetails.slice(
    startIndex,
    endIndex
  );
  return (
    <div className="es-container">
      <div className="es-window">
        {educationDetails.length > 0 && id && (
          <div className="es-window-header">
            <div className="es-window-title"></div>
            <button className="es-window-close" onClick={handleManageClick}>
              <img
                className="icon-set"
                src={require("../img/technical-support.png")}
                alt=""
              />
              Yönet
            </button>
          </div>
        )}
        <div className="es-window-body">
          {educationDetails.length > 0 ? (
            <div className="gui-window-subjects">
              <ul className="es-subjects-row es-subjects-header">
                <li className="es-subjects-header-star">&nbsp;</li>
                <li className="es-subjects-header-title">
                  <h3>Konu Adı</h3>
                </li>
                <li className="es-subjects-header-track">
                  <h3>Açıklama</h3>
                </li>
              </ul>
              {displayedEducationDetails.map((item, index) => (
                <ul
                  key={index}
                  className={`es-subjects-row ${
                    index % 2 === 0 ? "es-subjects-row-even" : ""
                  }`}
                >
                  <li className="es-subjects-star">
                    <span className={`circle circle-${index + 1}`}></span>
                  </li>
                  <li className="es-subjects-title">{item.subjectName}</li>
                  <li className="es-subjects-track">
                    {item.subjectDescription}
                  </li>
                </ul>
              ))}
            </div>
          ) : (
            <div className="es-no-data">
              <div>
                <h2>Henüz bu eğitime konu eklenmedi...</h2>
              </div>
              <div className="row-button-es">
                {id && (
                  <button
                    className="btn btn-create"
                    onClick={handleManageClick}
                  >
                    Ekle
                  </button>
                )}
              </div>
            </div>
          )}
          {educationDetails.length > 0 && id && (
            <div className="es-subjects-buttons">
              <button
                className="es-subjects-but-back"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Geri
              </button>
              <button
                className="es-subjects-but-back"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                İleri
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default EducationSubjectList;