import "../scss/education-details.scss";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ESList from "../../education-subject/components/ESList";
import EGList from "./EducationGroupList";
import SRList from "./EducationSRVideoList";
import { deleteEducation, getEducationById } from "../api/educationApi";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import { BsChevronCompactDown, BsGear, BsTrash } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";
import EducationGroupList from "./EducationGroupList";

import { getCategoryById } from "../../category/api/categoryApi";
import { getTechnicalUnitById } from "../../technicalunit/Api/technicalunitApi";

const EducationDetails = () => {
  const { id } = useParams();
  const [educationDetails, setEducationDetails] = useState(null);
  const navigate = useNavigate();
  const [showESList, setShowESList] = useState(false);
  const [showEGList, setShowEGList] = useState(false);
  const [showYKList, setShowYKList] = useState(false);
  const [isESListVisible, setIsESListVisible] = useState(false);
  const [isEGListVisible, setIsEGListVisible] = useState(false);
  const [isYKListVisible, setIsYKListVisible] = useState(false);
  const [dropdownText, setDropdownText] = useState("Konuları Listele");
  const [dropdownGrupText, setDropdownGrupText] = useState("Grupları Listele");
  const [technicalunit, setTechnicalunit] = useState("");

  useEffect(() => {
    getEducationById(id)
      .then((data) => {
        setEducationDetails(data);
        const parentCategoryId = data.parentCategoryId;

        getCategoryById(parentCategoryId)
          .then((categoryData) => {
            const technicalUnitId = categoryData.data.technicalUnitId;

            getTechnicalUnitById(technicalUnitId)
              .then((technicalUnitData) => {
                setTechnicalunit(technicalUnitData.data);
              })
              .catch((technicalUnitError) =>
                console.error("Technical Unit Error:", technicalUnitError)
              );
          })
          .catch((categoryError) =>
            console.error("Category Error:", categoryError)
          );
      })
      .catch((error) => {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, [id]);


  if (!educationDetails) {
    return <div>Loading...</div>;
  }

  const handleDeleteEducation = async (educationId) => {
    const isSuccess = await DeleteItem(
      id,
      deleteEducation // apiden gelen silme fonksiyonu
    );

    if (isSuccess) {
      navigate("../../education");
    }
  };

  const handleShowESList = () => {
    setShowESList(true);
    setIsESListVisible(!isESListVisible);
    setDropdownText(isESListVisible ? "Konuları Listele" : "Konuları Gizle");
  };

  const handleShowEGList = () => {
    setShowEGList(true);
    setIsEGListVisible(!isEGListVisible);
    setDropdownGrupText(
      isEGListVisible ? "Grupları Listele" : "Grupları Gizle"
    );
  };

  const handleDropdownAction = (option) => {
    if (option === "Düzenle") {
      navigate(`../educationupdate/${educationDetails.id}`);
    } else if (option === "Sil") {
      handleDeleteEducation(educationDetails.id);}
      else if (option === "Yardımcı Kaynakları Gör") {
        navigate(`../../education/educationsupplamentaryresourceoptions/${educationDetails.id}`);
    } else if (option === "Konuları Listele" || option === "Konuları Gizle") {
      // "Konuları Listele" seçildiyse ve Konular zaten görünür değilse göster
      if (option === "Konuları Listele" && !isESListVisible) {
        setIsESListVisible(true);
        setIsEGListVisible(false); // Grupları gizle
      } else {
        // Diğer durumda Konuları Gizle
        setIsESListVisible(false);
      }
    } else if (option === "Grupları Listele" || option === "Grupları Gizle") {
      // "Grupları Listele" seçildiyse ve Gruplar zaten görünür değilse göster
      if (option === "Grupları Listele" && !isEGListVisible) {
        setIsEGListVisible(true);
        setIsESListVisible(false); // Konuları gizle
      } else {
        // Diğer durumda Grupları Gizle
        setIsEGListVisible(false);
      }
    }
  };

  return (
    <div>
      <h1>Eğitim Detay</h1>
      <div className="education-details">
        <img
          className="line"
          src={require("../../../assets/img/substract.png")}
          alt=""
        />
        <div className="main-form-edu-detail">
          <div className="card">
            <div className="nav-edu">
              <h2>Eğitim Detayı</h2>
            </div>
            <div className="card-content">
              <div className="photo">
                <img src={require("../img/Screenshot_2.png")} alt="" />
              </div>
              <div className="card-content-details">
                <div className="description">
                  <div>
                    <h2>{educationDetails.name}</h2>
                    <h4>
                      <strong>{educationDetails.parentCategoryName}</strong> |{" "}
                      <strong>{educationDetails.subCategoryName}</strong> |{" "}
                      <strong>{technicalunit.name}</strong>
                    </h4>
                    <div className="row-education">
                      <h1>{educationDetails.courseHours} Saat</h1>
                    </div>
                    <p>{educationDetails.description}</p>
                  </div>
                </div>
                <div className="row-details">
                  <Dropdown
                    triggerText={
                      <span className="icon-size">
                        <SlOptions className="icon-size" />
                      </span>
                    }
                    options={["Düzenle", "Sil", dropdownText, dropdownGrupText, "Yardımcı Kaynakları Gör"]}
                    onOptionClick={handleDropdownAction}
                    customClassName="education-details-dropdown"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="education-details">{isESListVisible && <ESList/>}</div>
      <div className="list-settings">
        {isEGListVisible && <EducationGroupList id={id} />}
      </div>
      <div className="list-settings">
        {isYKListVisible && <SRList id={id} />}
      </div>
    </div>
  );
};

export default EducationDetails;
