import React, { useEffect, useState } from "react";
import "../scss/StudentHomeworkDetail.scss";
import "../../../trainer/homework/scss/button.scss";
import { useNavigate } from "react-router-dom";
// import { getHomeworkById } from "../../../admin/homework/Api/HomeworkApi";
import { updateStudentHomework, getStudentHomeworkId, downloadFileHomework, getHomeworkById } from "../api/studentHomeworkApi"
import { listAllSubject } from "../../subject/subjectApi";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToastContent from "../../../shared/toast-content/ToastContent";

let savedData = sessionStorage.getItem("savedData");
if (sessionStorage.getItem("savedData") != null) {
  savedData = sessionStorage.getItem("savedData").split(",");
  const role = savedData[1];
}

const HomeworkDetail = () => {
  const [homework, setHomework] = useState("");
  const [subjects, setSubjects] = useState([]);
  const { id } = useParams();
  const [referanceFile, setReferanceFile] = useState("");
  const navigate = useNavigate();
  // const [selectedFile, setSelectedFile] = useState(null);
  const [isHardDelete, setIsHardDelete] = useState(true);
  // const [resultMessage, setResultMessage] = useState("");
  // const [error, setError] = useState("");
  const [studentHomework, setStudentHomework] = useState("");
  const [title, setTitle] = useState([]);
  const [attachedFileError, setAttachedFileError] = useState("");
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
    const fetchData = async () => {
      try {
        const homework = await getHomeworkById(id);
        setHomework(homework.data);
        setTitle(homework.data.title);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Download error: ", error.message);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const subjects = await listAllSubject();
        setSubjects(subjects.data);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Konular alınırken hata oluştu: ", error);
      }
    };
    fetchSubjectData();
  }, []);

  useEffect(() => {
    const fetchStudentHomework = async () => {
      try {
        const studentHomework = await getStudentHomeworkId(savedData[2], id);
        setStudentHomework(studentHomework.data);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("StudentHomework alınırken hata oluştu: ", error);
      }
    };
    fetchStudentHomework();
  }, []);

  const convertFileToUrl = (data, fileType) => {
    const blob = new Blob([data.data], { type: fileType });
    return URL.createObjectURL(blob);
  };

  const handleDownloadFile = async (filePath, id) => {
    try {
      const fileResponse = await downloadFileHomework(filePath, id);
      if (fileResponse.status === 200) {
        const url = convertFileToUrl(fileResponse, fileResponse.data.type);
        window.open(url);
      } else if (fileResponse.status === 404) {
        throw new Error("Dosyaya ulaşılamadı");
      } else {
        throw new Error("Bilinmeyen bir hata oluştu");
      }
    } catch (error) {
      console.error("Download error: ", error.message);
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("id", studentHomework.id);
    data.append("attachedFile", referanceFile);
    data.append("isHardDelete", isHardDelete);
    try {
      const respo = await updateStudentHomework(data);
      const message = respo.data.message;
      setSuccessMessage(message);
      showToast(message, "success");
      setTimeout(() => {
        navigate("../studenthomeworklist");
      }, 2000);
    } catch (error) {
      console.error(error);
      setDefaultMessage(error.defaultMessage);
      if (error.validationErrors.AttachedFile) {
        setAttachedFileError(error.validationErrors.AttachedFile);
      } else {
        setAttachedFileError("");
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
  if (!studentHomework) {
    return <div>Loading...</div>;
  }

  return (
    <div className="student-homework-form-container">
      <h1>Ödev Detay</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />

      <div className="form-container">
        <form onSubmit={handleSubmit} className="card-body-detail">

          <div className="form-fields">
            <span className="form-label-title">{title}</span>
          </div>

          <div className="form-fields">
            <label className="form-label-small">Son Teslim Tarihi</label>
            <span className="form-label-small-sp">
              {new Date(homework.endDate).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="form-fields">
            <label className="form-label-small">Ödev Konusu</label>
            <span className="form-label-small-sp">
              {subjects.find((subject) => subject.id === homework.subjectId)
                ?.name || "Konu bulunmamaktadır."}
            </span>
          </div>

          <div className="form-fields">
            <label className="form-label-small">Talimatlar</label>
            <span className="form-label-textarea">{homework.intructions}</span>
          </div>

          <div className="form-fields">
            <label htmlFor="referanceFile" className="form-label-small">
              Ödev Dosyası
            </label>
            <span className="form-label-small-sp">
              {homework.referansFile ? (
                <a
                  className="anchor-referance"
                  href="#"
                  onClick={() =>
                    handleDownloadFile(homework.referansFile, homework.id)
                  }
                >
                  {homework.referansFile.split(".").pop() === "pdf"
                    ? "PDF Dosyasını Aç"
                    : homework.referansFile.split(".").pop() === "zip"
                      ? "Zip Dosyasını Aç"
                      : "Dosyayı Aç"}
                </a>
              ) : (
                "Dosya yok"
              )}
            </span>
          </div>

          <div className="form-fields">
            <label htmlFor="referanceFile" className="form-label-small">
              Çalışmam
            </label>
            <input
              className="form-label-small-sp"
              type="file"
              id="referanceFile"
              onChange={(e) => setReferanceFile(e.target.files[0])}
            />
          </div>

          {attachedFileError && <div className="error-message"> {attachedFileError} </div>}

          {showToast(apiMessageError, "error")}
          {showToast(defaultMessage, "error")}
          {showToast(successMessage, "success")}

          <div className="buttons-forms">
            <input type="submit" value="Teslim Et" className="submit-button" />
          </div>

        </form>
      </div>
      <div className="score-container">
        <label className="form-label-small">Puan</label>
        <span className="form-label-small-sp">Puan Üst Sınırı: 100</span>
      </div>
    </div>
  );
};

export default HomeworkDetail;
