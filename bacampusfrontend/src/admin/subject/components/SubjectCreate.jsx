import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { Link, useHistory } from "react-router-dom";
import { createSubject } from "../api/subjectApi";
import { toast, ToastContainer } from "react-toastify";
import  ToastContent  from "../../../shared/toast-content/ToastContent";

const SubjectCreate = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");
  const [apiMessageError, setApiMessageError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  }

  useEffect(() => {
    if (apiMessageError) {
      showToast(apiMessageError, "error");
      } else if (defaultMessage) {
      showToast(defaultMessage, "error");
    }
  }, [apiMessageError, defaultMessage]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      name: name,
      description: description,
    };
    try {
      const result = await createSubject(data);
      const message = result.data.message;
      setSuccessMessage(message);
        showToast(message, "success");
        setTimeout(() => {
          navigate("../../subjects");
        }, 2000);
       
    } catch (error) {
      console.error(error);
      setDefaultMessage(error.defaultMessage);
      if (error.validationErrors.Name) {
        setNameError(error.validationErrors.Name);
      } else {
        setNameError("");
      }
      if(error.validationErrors.message){
        setApiMessageError(error.validationErrors.message);
      }else{
        setApiMessageError("");
      }
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
    }
  };

  return (
    <div className="homework-form-container">
      <h1>Konu Ekle</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      <form className="card-body" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name" className="form-label">
            Konu Adı :
          </label>

          <input
            className="form-input"
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>
        <div>
        {nameError && <div className="error-message">{nameError}</div>}
        </div>
        <div className="form-field">
          <label htmlFor="description" className="form-label">
            Açıklama :
          </label>

          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            required
            rows="5"
            className="form-input"
            style={{fontFamily:"CustomFont",fontSize:"12.18px"}}
          />
        </div>
        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}
        <div className="buttons-form">
          <input type="submit" value="Ekle" className=" submit-button" />
          <Link className="submit-button backto-list" to={"/admin/subjects"}>
            Listeye Dön
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SubjectCreate;
