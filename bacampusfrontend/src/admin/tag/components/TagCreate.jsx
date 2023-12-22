import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createTag } from "../api/tagApi";
import ToastContent from "../../../shared/toast-content/ToastContent";

const TagCreate = () => {
  const [name, setName] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [errors, setError] = useState({});
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTag = await createTag({
        name: name,
      });
      const message = newTag.data.message;
      setSuccessMessage(message);
      showToast(message, "success");
      setTimeout(() => {
        navigate("/admin/tags");
      }, 2000);
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      setDefaultMessage(error.defaultMessage);

      if (error.errorMessages.message) {
        setApiMessageError(error.errorMessages.message);
      } else {
        setApiMessageError("");
      }
    }
  };

  return (
    <div className="homework-form-container">
      <h1>Etiket Ekle</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />

      <form className="card-body" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name" className="form-label">
            Etiket Adı :
          </label>

          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}
        <div className="buttons-form">
          <input type="submit" value="Ekle" className=" submit-button" />
          <Link className="submit-button backto-list" to={"/admin/tags"}>
            Listeye Dön
          </Link>
        </div>
      </form>
    </div>
  );
};

export default TagCreate;
