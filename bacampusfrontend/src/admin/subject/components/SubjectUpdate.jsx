import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  getSubjectById,
  listAllSubject,
  updateSubjects,
} from "../api/subjectApi";
import { toast, ToastContainer } from "react-toastify";
import ToastContent from "../../../shared/toast-content/ToastContent";

const SubjectUpdate = ({ }) => {
  const [subjectName, setSubjectName] = useState("");
  const [description, setDescription] = useState("");
  const [Subject, setSubject] = useState([]);
  const [errors, setError] = useState({});
  const [nameError, setNameError] = useState("");
  const [apiMessageError, setApiMessageError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { id } = useParams();
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


  useEffect(() => {
    fetchSubjectData();
  }, []);

  const fetchSubjectData = async () => {
    try {
      const subject = await getSubjectById(id);
      setSubjectName(subject.name);
      setDescription(subject.description);
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Veriler alınırken hata oluştu: ", error);
    }
  };

  // const updateSubject = async (data) => {
  //   const subData = {
  //     id: id,
  //     name: subjectName,
  //     description: description,
  //   };
  //   const response = await updateSubjects(subData);
  //   if (response.data.isSuccess){
  //     toast.success(response.data.message, {
  //       position: "bottom-right",
  //       autoClose: 2000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: false,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "colored",
  //     });
  //   } else {
  //     navigate("../../subjects");
  //     return response;
  //   }
  // };

  const handleUpdateSuccess = async (message) => {
    try {
      const response = await listAllSubject();

      setSubject(response);

      toast.warn(`${message}`, {
        position: "bottom-right",

        autoClose: 2000,

        hideProgressBar: false,

        closeOnClick: true,

        pauseOnHover: false,

        draggable: true,

        progress: undefined,

        theme: "colored",
      });
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Veri alınırken hata oluştu: ", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      id: id,
      name: subjectName,
      description: description,
    };

    try {
      const updatedSubject = await updateSubjects(data);
      const message = updatedSubject.data.message;
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
      <h1>Konu Guncelle</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-field">
          <label htmlFor="subjectName" className="form-label">
            Konu Adı :
          </label>
          <input
            type="text"
            id="subjectName"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
            className="form-input"
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Lütfen konunun açıklamasını girin."
            rows="5"
            className="form-input"
            style={{ fontFamily: "CustomFont", fontSize: "12.18px" }}
          ></textarea>
        </div>
        {errors.Description && (
          <div className="error-message-sm-subject">
            {errors.Description.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}

        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}

        <div className="buttons-form">
          <input
            type="submit"
            value="Guncelle"
            className=" submit-button"
          />
          <Link className="submit-button backto-list" to={"/admin/subjects"}>
            Listeye Dön
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SubjectUpdate;
