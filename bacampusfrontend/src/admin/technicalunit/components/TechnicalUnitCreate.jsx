import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createTechnicalUnit } from "../Api/technicalunitApi";
import { toast, ToastContainer } from "react-toastify";
import ToastContent from "../../../shared/toast-content/ToastContent";

const TechnicalUnitCreate = () => {
  const navigate = useNavigate();
  const [technicalUnitName, setTecnicalUnitName] = useState("");
  const [nameError, setNameError] = useState("");
  const [apiMessageError, setApiMessageError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  let savedData = sessionStorage.getItem("savedData");
  if (sessionStorage.getItem("savedData") != null) {
    savedData = sessionStorage.getItem("savedData").split(",");
  }

  const handleTechnicalUnitChange = (event) => {
    setTecnicalUnitName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      name: technicalUnitName,
    };
    try {
      const result = await createTechnicalUnit(data);
      const message=result.data.message;
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
      if(error.validationErrors.message){
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
      <h1>Teknik Birim Ekle</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />

      <form className="card-body" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name" className="form-label">Teknik Birim Adı : </label>

          <input
            className="form-input"
            type="text"
            id="name"
            name="name"
            value={technicalUnitName}
            onChange={handleTechnicalUnitChange}
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
            value="Ekle"
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

export default TechnicalUnitCreate;
