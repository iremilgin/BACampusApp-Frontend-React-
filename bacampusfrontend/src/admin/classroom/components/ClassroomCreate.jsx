import React, { useState } from "react";
import { useEffect } from "react";
import "../scss/ClassroomAdd.scss";
import { getAllEducation } from "../../education/api/educationApi";
import ToastContent from "../../../shared/toast-content/ToastContent";
import {
  createClassroom,
  getAllBranchBy,
  getAllTrainingType,
  getAllGroupTypeBy,
} from "../api/classroomApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
export const ClassroomCreate = () => {
  const [name, setName] = useState("");
  const [educationId, setEducationId] = useState("");
  const [branchId, setbranchId] = useState("");
  const [trainingTypeId, setTrainingTypeId] = useState("");
  const [groupTypeId, setGroupTypeId] = useState("");
  const [openDate, setOpenDate] = useState("");
  const [closedDate, setClosedDate] = useState("");
  const [groupTypeList, setGroupTypeList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [trainingTypeList, setTrainingTypeList] = useState([]);
  const [apiMessageError, setApiMessageError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [resultMessage, setResultMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [nameError, setNameError] = useState("");
  const [openDateError, setOpenDateError] = useState("");
  const [closedDateError, setClosedDateError] = useState("");

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
    fetchEducationList();
    fetchBranchList();
    fetchTrainingTypeList();
    fetchGroupTypeList();
  }, []);

  const fetchEducationList = async () => {
    try {
      const result = await getAllEducation();
      setDataList(result);
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Error fetching education list:", error);
    }
  };

  const fetchBranchList = async () => {
    try {
      const result = await getAllBranchBy();
      setBranchList(result);
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Error fetching education list:", error);
    }
  };

  const fetchTrainingTypeList = async () => {
    try {
      const list = await getAllTrainingType();
      setTrainingTypeList(list);
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Error fetching trainingType list:", error);
    }
  };

  const fetchGroupTypeList = async () => {
    try {
      const result = await getAllGroupTypeBy();
      setGroupTypeList(result);
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Error fetching education list:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createClassroom({
        name: name,
        educationId: educationId,
        openDate: openDate,
        closedDate: closedDate,
        groupTypeId: groupTypeId,
        branchId: branchId,
        trainingTypeId: trainingTypeId,
      });

      const message = response.data.message;
      setSuccessMessage(message);
      showToast(message, "success");
      setTimeout(() => {
        navigate("../../classroom");
      }, 2000);
    } catch (error) {
      setDefaultMessage(error.defaultMessage);
      if (error.errorMessages.Name) {
        setNameError(error.errorMessages.Name);
      } else {
        setNameError("");
      }
      if (error.errorMessages.OpenDate) {
        setOpenDateError(error.errorMessages.OpenDate);
      } else {
        setOpenDateError("");
      }
      if (error.errorMessages.ClosedDate) {
        setClosedDateError(error.errorMessages.ClosedDate);
      } else {
        setClosedDateError("");
      }
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
      <h1>Grup Ekle</h1>
      <img className="line" src={require("../img/substract.png")} alt="" />
      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-field">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="name" className="form-label">
                  Sınıf Adı :
                </label>
                <input
                  className="form-input"
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                {nameError && <div className="error-message">{nameError}</div>}
              </div>
            </div>
            <div className="trainer-row-space">
              <div className="input-container">
                <label
                  htmlFor="trainingType"
                  className="form-label right-label"
                >
                  Eğitim Tipini Seçiniz :
                </label>
                <select
                  id="trainingTypeId"
                  value={trainingTypeId}
                  onChange={(e) => setTrainingTypeId(e.target.value)}
                  required
                  className="form-input"
                >
                  <option className="option" value={0}>
                    Lütfen Seçim Yapınız
                  </option>
                  {trainingTypeList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="form-field">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="branchId" className="form-label">
                  Şube Seçiniz :
                </label>
                <select
                  id="branchId"
                  value={branchId}
                  onChange={(e) => setbranchId(e.target.value)}
                  required
                  className="form-input"
                >
                  <option className="option" value={0}>
                    Lütfen Seçim Yapınız
                  </option>
                  {branchList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="groupTypeId" className="form-label right-label">
                  Grup Tipi Seçiniz :
                </label>
                <select
                  id="groupTypeId"
                  value={groupTypeId}
                  onChange={(e) => setGroupTypeId(e.target.value)}
                  required
                  className="form-input"
                >
                  <option className="option" value={0}>
                    Lütfen Seçim Yapınız
                  </option>
                  {groupTypeList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="form-field">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="openDate" className="form-label">
                  Başlama Tarihi :
                </label>
                <input
                  id="openDate"
                  type="date"
                  value={openDate}
                  required
                  onChange={(e) => setOpenDate(e.target.value)}
                  className="form-input calender"
                />
              </div>
              <div>
                {openDateError && (
                  <div className="error-message">{openDateError}</div>
                )}
              </div>
            </div>
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="closedDate" className="form-label right-label">
                  Bitirme Tarihi :
                </label>
                <input
                  id="closedDate"
                  type="date"
                  value={closedDate}
                  required
                  onChange={(e) => setClosedDate(e.target.value)}
                  className="form-input calender"
                />
              </div>
              <div>
                {closedDateError && (
                  <div className="error-message" style={{ marginLeft: "24px" }}>
                    {closedDateError}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="form-field">
          <label
            htmlFor="educationId"
            className="form-label right-label"
            style={{ paddingLeft: "0" }}
          >
            Eğitim Seçiniz :
          </label>
          <select
            id="educationId"
            value={educationId}
            onChange={(e) => setEducationId(e.target.value)}
            required
            className="form-input"
          >
            <option className="option" value={0}>
              Lütfen Seçim Yapınız
            </option>

            {dataList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}
        <div className="buttons-form">
          <input type="submit" value="Ekle" className=" submit-button" />
          <Link className="submit-button backto-list" to={"/admin/classroom"}>
            Listeye Dön
          </Link>
        </div>

        {defaultMessage && (
          <div className="error-message">{defaultMessage}</div>
        )}
      </form>
    </div>
  );
};
export default ClassroomCreate;
