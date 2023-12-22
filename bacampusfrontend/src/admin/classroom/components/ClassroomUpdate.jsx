import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ToastContent from "../../../shared/toast-content/ToastContent";

import {
  getClassroomById,
  updateClassroom,
  getAllBranchBy,
  getAllTrainingType,
  getAllGroupTypeBy,
} from "../api/classroomApi";
import { getAllEducation } from "../../education/api/educationApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ClassroomUpdate = () => {
  const [name, setName] = useState("");
  const [educationId, setEducationId] = useState(0);
  const [educationList, setEdicationList] = useState([]);
  const [branchId, setBranchId] = useState(0);
  const [branchList, setBranchList] = useState([]);

  const [groupTypeId, setGroupTypeId] = useState(0);
  const [groupTypeList, setGroupTypeList] = useState([]);
  const [apiMessageError, setApiMessageError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [openDate, setOpenDate] = useState("");
  const [closedDate, setClosedDate] = useState("");
  const [groupType, setGroupType] = useState(0);
  const [errors, setErrors] = useState({});
  const [resultMessage, setResultMessage] = useState("");
  const [trainingTypeId, setTrainingTypeId] = useState("");
  const [trainingTypeList, setTrainingTypeList] = useState([]);
  const [nameError, setNameError] = useState("");
  const [openDateError, setOpenDateError] = useState("");
  const [closedDateError, setClosedDateError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  let savedData = sessionStorage.getItem("savedData");
  if (sessionStorage.getItem("savedData") != null) {
    savedData = sessionStorage.getItem("savedData").split(",");
    const role = savedData[1];
  }

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
    fetchClassroomById();
    fetchEducationList();
    fetchBranchList();
    //fetchClassroomData();
    fetchTrainingTypeList();
    fetchGroupTypeList();
  }, []);

  const fetchEducationList = async () => {
    try {
      const result = await getAllEducation();
      setEdicationList(result);
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
      console.error("Error fetching group list:", error);
    }
  };

  const fetchClassroomById = async () => {
    try {
      const classroom = await getClassroomById(id);

      setName(classroom.data.name);
      setEducationId(classroom.data.educationId);
      setBranchId(classroom.data.branchId);
      setOpenDate(classroom.data.openDate);
      setClosedDate(classroom.data.closedDate);
      setGroupTypeId(classroom.data.groupTypeId);
      setTrainingTypeId(classroom.data.trainingTypeId);
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Error fetching classroom:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await updateClassroom(id, {
        id: id,
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
  const formattedOpenDate = openDate ? openDate.split("T")[0] : "";
  const formattedClosedDate = closedDate ? closedDate.split("T")[0] : "";

  return (
    <div className="homework-form-container">
      <h1>Grup Guncelle</h1>
      <img className="line" src={require("../img/substract.png")} alt="" />

      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-field">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="name" className="form-label">
                  Grup Adı :
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
                  onChange={(e) => setBranchId(e.target.value)}
                  required
                  className="form-input"
                >
                  <option className="option" value={0}>
                    Lütfen Seçim Yapın
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
                    Lütfen Seçim Yapın
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
                  value={formattedOpenDate}
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
                  value={formattedClosedDate}
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
            className="form-label right-label special-settings"
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
              Lütfen Seçim Yapın
            </option>
            {educationList.map((item) => (
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
          <input type="submit" value="Guncelle" className=" submit-button" />
          <Link className="submit-button backto-list" to={"/admin/classroom"}>
            Listeye Dön
          </Link>
        </div>

        {resultMessage && <div className="error-message">{resultMessage}</div>}
      </form>
    </div>
  );
};
export default ClassroomUpdate;
