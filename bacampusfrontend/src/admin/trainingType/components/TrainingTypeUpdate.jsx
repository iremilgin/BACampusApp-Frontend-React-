import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  updateTrainingType,
  getTrainingTypeById,
} from "../api/trainingtypeApi.js";
import { toast, ToastContainer } from "react-toastify";
import ToastContent from "../../../shared/toast-content/ToastContent";

const TrainingTypeUpdate = ({}) => {
  const [trainingTypeName, setTrainingTypeName] = useState("");
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
    trainingData(id);
  }, [id]);

  const trainingData = async (id) => {
    try {
      const training = await getTrainingTypeById(id);
      setTrainingTypeName(training.name);
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
      name: trainingTypeName,
    };

    try {
      const updateTraining = await updateTrainingType(data);
      const message = updateTraining.data.message;
      setSuccessMessage(message);
      showToast(message, "success");
      setTimeout(() => {
        navigate("../../trainingtype");
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
      <h1>Eğitim Tipi Güncelle</h1>
      <img className="line" src={require("../../../assets/img/substract.png")} alt="" />
      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-field">
          <label htmlFor="trainingTypeName" className="form-label">
            Eğitim Tipi :
          </label>
          <input
            type="text"
            id="trainingTypeName"
            value={trainingTypeName}
            onChange={(e) => setTrainingTypeName(e.target.value)}
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
            to={"/admin/trainingtype"}
          >
            Listeye Dön
          </Link>
        </div>
      </form>
    </div>
  );
};

export default TrainingTypeUpdate;
