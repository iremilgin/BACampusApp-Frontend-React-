import React, { useEffect, useState } from "react";
import { listAllSubject } from "../../subject/api/subjectApi";
import "../../../assets/scss/button.scss";
import { getHomeworkById, downloadFileHomework } from "../Api/HomeworkApi";
import { useParams, useNavigate, Link } from "react-router-dom";
let savedData = sessionStorage.getItem("savedData");
if (sessionStorage.getItem("savedData") != null) {
  savedData = sessionStorage.getItem("savedData").split(",");
}
const HomeworkDetails = () => {
  const [homework, setHomework] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homework = await getHomeworkById(id);
        setHomework(homework.data);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Download error: ", error.message);
      }
    };
    fetchData();
  }, [id]);
  const convertFileToUrl = (data, fileType) => {
    const blob = new Blob([data.data], { type: fileType });
    return URL.createObjectURL(blob);
  };
  const handleDownloadFile = async (filePath, id) => {
    try {
      const fileResponse = await downloadFileHomework(filePath, id);
      if (fileResponse.status == 200) {
        const url = convertFileToUrl(fileResponse, fileResponse.data.type);
        window.open(url);
      } else if (fileResponse.status == 404) {
        throw new Error("Dosyaya ulaşılamadı");
      } else {
        throw new Error("Bilinmeyen bir hata oluştu");
      }
    } catch (error) {
      console.error("Download error: ", error.message);
      alert(error.message);
    }
  };

  if (!homework) {
    return <div>Loading...</div>;
  }
  const formatDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };

  return (
    <div className="homework-form-container">
      <h1>Ödev Detay</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />

      <form className="card-body">
        <div className="form-field">
          <div className="form-field">
            <label className="form-label">Başlık :</label>
            <span className="form-label">{homework.title}</span>
          </div>
          <div className="form-field">
            <label className="form-label">Konu :</label>
            <span className="form-label">
              {subjects.find((subject) => subject.id === homework.subjectId)
                ?.name || "Konu bulunmamaktadır."}
            </span>
          </div>
        </div>

        <div className="form-field">
          <div className="form-field">
            <label className="form-label">Başlangıç Tarihi :</label>
            <span className="form-label">
              {new Date(homework.startDate).toLocaleString("tr-TR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
          </div>

          <div className="form-field">
            <label className="form-label ">Bitiş Tarihi :</label>
            <span className="form-label">
              {new Date(homework.endDate).toLocaleString("tr-TR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
          </div>
        </div>
        <div className="form-field">
          <div className="form-field">
            <label htmlFor="referenceFile" className="form-label">
              Referans Dosya :
            </label>
            <span className="form-label">
              {homework.referansFile ? (
                <a
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

          <div className="form-field">
            <label className="form-label">Geç Teslim :</label>
            <span className="form-label">
              {homework.isLateTurnedIn ? "Evet" : "Hayır"}
            </span>
            <label className="form-label">Puanlanabilir :</label>
            <span className="form-label">
              {homework.isHasPoint ? "Evet" : "Hayır"}
            </span>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label ">Talimatlar :</label>
          <span className="form-label-textarea">{homework.intructions}</span>
        </div>
      </form>
    </div>
  );
};


export default HomeworkDetails;
