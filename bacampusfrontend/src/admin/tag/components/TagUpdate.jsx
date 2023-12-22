import React, { useState, useEffect } from "react";
import { updateTag, getTagById } from "../api/tagApi";
import { useNavigate, useParams, Link } from "react-router-dom";
import  ToastContent  from "../../../shared/toast-content/ToastContent";

const TagUpdate = () => {
  const [name, setName] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const [apiMessageError, setApiMessageError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  useEffect(() => {
    fetchTagData();
  }, []);

  const fetchTagData = async (id) => {
    try {
      const tag = await getTagById(id);
      setName(tag.data.name);
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Veriler alınırken hata oluştu: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages([]);

    const data = {
      id: id,
      name: name,
    };

    try {
      const response = await updateTag(id, data);
      const message = response.data.message;
      setSuccessMessage(message);
      showToast(message,"success");
       setTimeout(() => {
         navigate(`../../tags`);
       }, 2000);
    } catch (error) {

      setDefaultMessage(error.defaultMessage);

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

  return (
    <div className="homework-form-container">
      <h1>Etiket Guncelle</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />

      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-field">
          <label htmlFor="firstName" className="form-label">
            Etiket Adı :
          </label>
          <input
            type="text"
            id="firstName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        {errorMessages.length > 0 && (
          <div className="error-message">
            {errorMessages.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}
        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}
        <div className="buttons-form">
          <input type="submit" value="Guncelle" className=" submit-button" />
          <Link className="submit-button backto-list" to={"/admin/tags"}>
            Listeye Dön
          </Link>
        </div>
      </form>
    </div>
  );
};

export default TagUpdate;
