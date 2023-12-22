import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {createGroupType} from "../api/grouptypeApi.js"
import { toast, ToastContainer } from "react-toastify";
import ToastContent from "../../../shared/toast-content/ToastContent.jsx";

const GroupTypeCreate = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
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

  const handleNameChange = (event) => {
    setName(event.target.value);
    console.log("Submit button clicked!");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      name: name,
    };
    try {
      const result = await createGroupType(data);
      const message = result.data.message;
      setSuccessMessage(message);
        showToast(message, "success");
        setTimeout(() => {
          navigate("../../grouptype");
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
    <div>
      <h1>Grup Tipi Ekle</h1>
      <img className="line" src={require("../img/substract.png")} alt="" />

      <form className="card-body" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name" className="form-label">
            Grup Tipi :
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
        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}
        <div className="buttons-form">
          <input type="submit" value="Ekle" className=" submit-button" />
          <Link className="submit-button backto-list" to={"/admin/grouptype"}>
            Listeye Dön
          </Link>
        </div>
      </form>
    </div>
  );
};

export default GroupTypeCreate;
