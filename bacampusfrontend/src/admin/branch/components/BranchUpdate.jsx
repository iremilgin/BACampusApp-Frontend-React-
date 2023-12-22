import React, { useState, useEffect }  from 'react'
import { getBranchById, updateBranch } from '../api/branchApi';
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ToastContent from "../../../shared/toast-content/ToastContent";

const BranchUpdate = () => {
    const [branchName, setBranchName] = useState("");
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
        const branch = await getBranchById(id);
        setBranchName(branch.name);
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
          name: branchName,
        };
    
        try {
          const updateTraining = await updateBranch(data);
          const message = updateTraining.data.message;
          setSuccessMessage(message);
          showToast(message, "success");
          setTimeout(() => {
            navigate("../../branch");
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
    <div>
        <h1>Şube Güncelle</h1>
      <img className="line" src={require("../img/substract.png")} alt="" />
      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-field">
          <label htmlFor="trainingTypeName" className="form-label">
            Şube Adı :
          </label>
          <input
            type="text"
            id="branchName"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
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
            to={"/admin/branch"}
          >
            Listeye Dön
          </Link>
        </div>
      </form>
    </div>
  )
}

export default BranchUpdate