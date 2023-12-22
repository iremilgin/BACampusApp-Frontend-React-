import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { updateCategorys, getCategoryById } from "../api/categoryApi";
import { listAllTechnicalUnit } from "../../technicalunit/Api/technicalunitApi";
import { toast, ToastContainer } from "react-toastify";
import ToastContent from "../../../shared/toast-content/ToastContent";

function CategoryUpdate() {
  const [categoryName, setCategoryName] = useState("");
  const [technicalUnit, setTecnicalUnit] = useState("");
  const [technicalUnits, setTecnicalUnits] = useState([]);
  const [error, setError] = useState([]);
  const [resultMessage, setResultMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [apiMessageError, setApiMessageError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  let savedData = sessionStorage.getItem("savedData");
  if (savedData != null) {
    savedData = savedData.split(",");
  }
  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };

  useEffect(() => {
    if (apiMessageError) {
      showToast(apiMessageError, "error");
    } else if (defaultMessage) {
      showToast(defaultMessage, "error");
    }
  }, [apiMessageError, defaultMessage]);

  useEffect(() => {
    getCategoryById(id)
      .then((data) => {
        setCategoryName(data.data.name);
        setTecnicalUnit(data.data.technicalUnitId);
      })
      .catch((error) => {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, [id]);

  useEffect(() => {
    listAllTechnicalUnit()
      .then((data) => {
        setTecnicalUnits(data.data);
      })
      .catch((error) =>{
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await updateCategorys(id, {
        id: id,
        name: categoryName,
        technicalUnitId: technicalUnit || null,
      });

      const message = data.data.message;
      setSuccessMessage(message);
      showToast(message, "success");
      setTimeout(() => {
        navigate(`/admin/category`);
      }, 2000);
    } catch (error) {
      setResultMessage(error.defaultMessage);
      if (error.errorMessages.Name) {
        setNameError(error.errorMessages.Name);
      } else {
        setNameError("");
      }
      if (error.errorMessages.message) {
        setApiMessageError(error.errorMessages.message);
      } else {
        setApiMessageError("");
      }
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
    }
  };
  const handleTecnicalUnitChange = (e) => {
    const selectedValue = e.target.value;
    setTecnicalUnit(selectedValue);
  };

  return (
    <div className="homework-form-container">
      <h1>Kategori Güncelle</h1>
      <img className="line" src={require("../img/substract.png")} alt="" />

      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-field">
          <label htmlFor="name" className="form-label">
            Kategori Adı :
          </label>

          <input
            className="form-input"
            type="text"
            id="name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>
        {nameError && <div className="error-message">{nameError}</div>}
        <div className="form-field">
          <label htmlFor="tecnicalUnitId" className="form-label">
            Teknik Birim Seçiniz :
          </label>

          <select
            id="tecnicalUnitId"
            value={technicalUnit}
            onChange={handleTecnicalUnitChange}
            required
            className="form-input"
          >
            {technicalUnits.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}
        <div className="buttons-form">
          <input type="submit" value="Guncelle" className="submit-button" />
          <Link className="submit-button backto-list" to={"/admin/category"}>
            Listeye Dön
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CategoryUpdate;
