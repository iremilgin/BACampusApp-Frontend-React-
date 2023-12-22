import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  updateGroupType,
  getGroupTypeById,
} from "../api/grouptypeApi.js";
import { toast, ToastContainer } from "react-toastify";
import ToastContent from "../../../shared/toast-content/ToastContent.jsx";

const GroupTypeUpdate = ({}) => {
  const [groupTypeName, setGroupTypeName] = useState("");
  const [nameError, setNameError] = useState("");
  const [apiMessageError, setApiMessageError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { id } = useParams();
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
    groupData(id);
  }, [id]);

  const groupData = async (id) => {
    try {
      const group = await getGroupTypeById(id);
      setGroupTypeName(group.name);
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Veriler alınırken hata oluştu: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      id: id,
      name: groupTypeName,
    };

    try {
      const updateGroup = await updateGroupType(data);
      const message = updateGroup.data.message;
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
      if (error.validationErrors.message) {
        setApiMessageError(error.validationErrors.message);
      } else {
        setApiMessageError("");
      }
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
    }
  };

  return (
    <div className="homework-form-container">
      <h1>Grup Tipi Güncelle</h1>
      <img className="line" src={require("../../../assets/img/substract.png")} alt="" />
      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-field">
          <label htmlFor="groupTypeName" className="form-label">
            Grup Tipi :
          </label>
          <input
            type="text"
            id="groupTypeName"
            value={groupTypeName}
            onChange={(e) => setGroupTypeName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div>
          {nameError && <div className="error-message">{nameError}</div>}
        </div>

        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}

        <div className="buttons-form">
          <input type="submit" value="Guncelle" className=" submit-button" />
          <Link
            className="submit-button backto-list"
            to={"/admin/grouptype"}
          >
            Listeye Dön
          </Link>
        </div>
      </form>
    </div>
  );
};

export default GroupTypeUpdate;
