import React, { useState, useEffect } from "react";
import { getHomeworkById, updateHomework } from "../Api/HomeworkApi";
import { listAllSubject } from "../../subject/api/subjectApi";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../scss/HomeworkAdd.scss";
import Checkbox from "@mui/material/Checkbox";
import  ToastContent  from "../../../shared/toast-content/ToastContent";

//Yetkilendirme
let savedData = sessionStorage.getItem("savedData");
let role;

if (savedData != null) {
  savedData = savedData.split(",");
  role = savedData[1];
}

const HomeworkUpdate = () => {
  const [title, setTitle] = useState("");
  const [intructions, setInstructions] = useState("");
  const [description, setDescription] = useState("");
  const [referanceFile, setReferanceFile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubject] = useState("");
  const [isLateTurnedIn, setIsLateTurnedIn] = useState(false);
  const [isHasPoint, setIsHasPoint] = useState(false);
  const [isHardDelete, setIsHardDelete] = useState(false);

  const [titleError, setTitleError] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");

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

  const { id } = useParams();
  const navigate = useNavigate();
  let savedData = sessionStorage.getItem("savedData");
  if (savedData != null) {
    savedData = savedData.split(",");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homework = await getHomeworkById(id);
        setTitle(homework.data.title);
        setInstructions(homework.data.intructions);
        setDescription(homework.data.description);
        setReferanceFile(homework.data.referanceFile);
        setStartDate(homework.data.startDate);
        setEndDate(homework.data.endDate);
        setSubject(homework.data.subjectId);
        setIsLateTurnedIn(homework.data.isLateTurnedIn);
        setIsHasPoint(homework.data.isHasPoint);
        setIsHardDelete(homework.data.isHardDelete);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        showToast("Veriler alınırken hata oluştu", "error");
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const response = await listAllSubject();
        setSubjects(response.data);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Konular alınırken hata oluştu: ", error);
      }
    };
    fetchSubjectData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      id: id,
      title: title,
      intructions: intructions,
      description: description,
      referanceFile: referanceFile,
      startDate: startDate,
      endDate: endDate,
      subjectId: subjectId,
      isLateTurnedIn: isLateTurnedIn,
      isHasPoint: isHasPoint,
      isHardDelete: isHardDelete,
    };

    try {
      const response = await updateHomework(data);
      const message = response.data.message;
     setSuccessMessage(message);
     showToast(message,"success");
      setTimeout(() => {
        navigate("../../homework");
      }, 2000);
    } catch (error) {
      setDefaultMessage(error.defaultMessage);
      if (error.errorMessages.Title) {
        setTitleError(error.errorMessages.Title);
      } else {
        setTitleError("");
      }
      if (error.errorMessages.StartDate) {
        setStartDateError(error.errorMessages.StartDate);
      } else {
        setStartDateError("");
      }
      if (error.errorMessages.EndDate) {
        setEndDateError(error.errorMessages.EndDate);
      } else {
        setEndDateError("");
      }
      if (error.errorMessages.message) {
        setApiMessageError(error.errorMessages.message);
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
      <h1>Ödev Güncelle</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-field">
          <label htmlFor="title" className="form-label">
            Başlık :
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div>
          {titleError && <div className="error-message">{titleError}</div>}
        </div>
        <div className="form-field trainer-input">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="startDate" className="form-label"style={{marginRight:"20px"}}>
                  Başlangıç Tarihi :
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="form-input calender "
                />
              </div>
              <div>
                {startDateError && (
                  <div className="error-message">{startDateError}</div>
                )}
              </div>
            </div>
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="endDate" className="form-label right-label" style={{marginRight:"22px"}}>
                  Bitiş Tarihi :
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="form-input calender"
                />
              </div>
              <div>
                {endDateError && (
                  <div className="error-message" style={{ marginLeft: "24px" }}>
                    {endDateError}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="subjectId" className="form-label">
            Konu :
          </label>
          <select
            id="subCategory"
            value={subjectId}
            onChange={(e) => setSubject(e.target.value)}
            className="form-input option"
          >
            <option className="option" value="0">
              Seçiniz
            </option>
            {subjects.map((sbj) => (
              <option key={sbj.id} value={sbj.id}>
                {sbj.name}
              </option>
            ))}
          </select>
          <label htmlFor="referanceFile" className="form-label right-label">
            Referans Dosya :
          </label>
          <input
            type="file"
            id="referanceFile"
            onChange={(e) => setReferanceFile(e.target.files[0])}
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label htmlFor="instructions" className="form-label">
            Talimatlar :
          </label>
          <textarea
            id="instructions"
            value={intructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows="5"
            className="form-input"
            style={{ fontFamily: "CustomFont", fontSize: "12.18px" }}
          />
        </div>
        <div className="otherinformation">
          <div className="gecteslim">
            <Checkbox
              className="form-input checkbox"
              type="checkbox"
              value="late"
              checked={isLateTurnedIn}
              onChange={() => setIsLateTurnedIn(!isLateTurnedIn)}
            ></Checkbox>
            <label className="form-label" htmlFor="gecteslim">
              Geç Teslime Izin Ver
            </label>
          </div>
          <div className="puan">
            <Checkbox
              className="form-input checkbox"
              type="checkbox"
              value="has-point"
              checked={isHasPoint}
              onChange={() => setIsHasPoint(!isHasPoint)}
            ></Checkbox>
            <label className="form-label" htmlFor="puan">
              Puanlanabilir
            </label>
          </div>
        </div>

        
        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}
        <div className="buttons-form">
          <input type="submit" value="Güncelle" className="submit-button" />
          <Link className="submit-button backto-list" to={"/admin/homework"}>
            Listeye Dön
          </Link>
        </div>
      </form>
    </div>
  );
};

export default HomeworkUpdate;
