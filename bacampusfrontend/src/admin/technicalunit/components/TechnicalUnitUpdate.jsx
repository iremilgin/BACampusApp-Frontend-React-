import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getTechnicalUnitById,
  updateTechnicalUnits,
} from "../Api/technicalunitApi";
import { toast, ToastContainer } from "react-toastify";
import ToastContent from "../../../shared/toast-content/ToastContent";

const TechnicalUnitUpdate = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [apiMessageError, setApiMessageError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };

  let savedData = sessionStorage.getItem("savedData");
  if (sessionStorage.getItem("savedData") != null) {
    savedData = sessionStorage.getItem("savedData").split(",");
  }

  useEffect(() => {
    fetchTechUnitData();
  }, []);
  
  useEffect(() => {
    if (apiMessageError) {
      showToast(apiMessageError, "error");
    } else if (defaultMessage) {
      showToast(defaultMessage, "error");
    }
  }, [apiMessageError, defaultMessage]);


  const fetchTechUnitData = async () => {
    try {
      const techUnit = await getTechnicalUnitById(id);
      // setResultMessage("");
      setName(techUnit.data.name);
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      }
      console.error("Veriler alınırken hata oluştu: ", error);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    // setError({});

    const data = {
      id: id,
      name: name,
    };

    try {
     const response = await updateTechnicalUnits(id, data);
      // setResultMessage("Kategori başarıyla eklendi.");
      const message=response.data.message;
      setSuccessMessage(message);
      showToast(message, "success");
        setTimeout(() => {
          navigate(`../technicalunits`);
      }, 2000);
       
    } catch (error) {
      setDefaultMessage(error.defaultMessage);
      console.error(error);
      if (error.validationErrors.Name) {
        setNameError(error.validationErrors.Name);
      } else {
        setNameError("");
      }
      if (error.validationErrors.message) {
        setApiMessageError(error.validationErrors.message);
      }
      else{
        setApiMessageError("");
      }
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      }
    }
  };

  return (
    <div className="homework-form-container">
      <h1>Teknik Birim Guncelle</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      <form className="card-body" onSubmit={handleSubmit}>
        <div className="form-field">

          <label className="form-label" htmlFor="name">Teknik Birim Adı :</label>


          <input
            className="form-input"
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {nameError && <div className="error-message">{nameError}</div>}
        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}
        <div className="buttons-form">
          <input
            type="submit"
            value="Guncelle"
            className=" submit-button"
          />
          <Link className="submit-button backto-list" to={"/admin/technicalunits"}>
            Listeye Dön
          </Link>
        </div>
        
      </form>
      
    </div>
  );
};

export default TechnicalUnitUpdate;
