import "../scss/education-list.scss";
import React, { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { getAllEducation } from "../api/educationApi";
import { Button } from "semantic-ui-react";
const EducationList = () => {
  const [educations, setEducations] = useState([]);
  const navigate = useNavigate();
  useEffect((e) => {
    getAllEducation()
      .then((data) => {
        setEducations(data);
      })
      .catch((error) => {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, []);
  
  const handleCreate = () =>{
    navigate(`./educationcreate`)
  }
  return (
    <div>
        <h1>Eğitimler</h1>
        <img
          className="line"
          src={require("../../../assets/img/substract.png")}
          alt=""
        />
          <Button className="btn-create" onClick={ () => handleCreate()} >
        Ekle
      </Button>
        <div className="row-button-create">
          {/* <Link to={`educationcreate`} className="btn btn-primary-2">
            Ekle
          </Link> */}
        </div>
        <div className="row-education-list">
          {educations.map((education) => (
            <div className="education-card" key={education.id}>
              <div className="education-card-header">
                <h2>{education.name}</h2>
              </div>
              <div className="education-card-body">
                <div className="row-education">
                  <img src={require("../img/category.png")} alt="" />
                  <p>{education.categoryName}</p>
                </div>
                <div className="row-education">
                  <img src={require("../img/clock.png")} alt="" />
                  <p>{education.courseHours} Saat</p>
                </div>
              </div>
              <div className="education-card-footer">
                <Link
                  to={`./educationdetail/${education.id}`}
                  className="btn btn-primary-edu-1"
                >
                  Detay Görüntüle
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
export default EducationList;