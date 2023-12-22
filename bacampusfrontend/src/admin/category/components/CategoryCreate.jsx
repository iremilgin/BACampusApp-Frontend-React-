import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createCategory } from "../api/categoryApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { listAllTechnicalUnit } from "../../technicalunit/Api/technicalunitApi.js";
import ToastContent from "../../../shared/toast-content/ToastContent.jsx";
function CategoryCreate() {
  const [tecnicalUnit, setTecnicalUnit] = useState("");
  const [tecnicalUnits, setTecnicalUnits] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [nameError, setNameError] = useState("");
  const [technicalUnitError, setTechnicalUnitError] = useState("");
 

  
  const [apiMessageError, setApiMessageError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
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
      const data = await createCategory({
        name: categoryName || null,
        technicalUnitId: tecnicalUnit || null,
        parentCategoryId: null,
      });

      const message = data.data.message;
      setSuccessMessage(message);
      showToast(message, "success");
      setTimeout(() => {
        navigate(`/admin/category`);
      }, 2000);
    } catch (error) {
      setDefaultMessage(error.defaultMessage);
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
    setTecnicalUnit(e.target.value);
  };

  return (
    <div className="homework-form-container">
      <h1>Kategori Ekle</h1>
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
            required
          />
        </div>
        {nameError && <div className="error-message">{nameError}</div>}

        <div className="form-field">
          <label htmlFor="tecnicalUnitId" className="form-label">
            Teknik Birim Seçiniz :
          </label>

          <select
            id="tecnicalUnitId"
            value={tecnicalUnit}
            onChange={handleTecnicalUnitChange}
            required
            className="form-input"
          >
            <option className="option" value="0">
              Lütfen Seçim Yapın
            </option>
            {tecnicalUnits.map((item) => (
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
          <input type="submit" value="Ekle" className="submit-button" />
          <Link className="submit-button backto-list" to={"/admin/category"}>
            Listeye Dön
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CategoryCreate;
