import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  downloadFileStudentHomework,
  getStudentListByHomeworkId,
} from "../Api/HomeworkApi";
//alttakiyle değiştirildi import "../../../trainer/homework/scss/StudentHomeworkDetails.scss";
import "../scss/HomeworkDetails.scss";
import { FaFilePdf, FaFileZipper, FaFile } from "react-icons/fa6";
import { FaUserCircle, FaInfoCircle } from "react-icons/fa";


//Yetkilendirme
let savedData = sessionStorage.getItem("savedData");
let role;

if (savedData != null) {
  savedData = savedData.split(",");
  role = savedData[1];
}
//Tarih formatı
function formatDate(dateString) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("tr-TR", options);
}
const StudentModal = ({ isOpen, onClose }) => {
  const { homeworkId, studentHomeworkId } = useParams();
  const [data, setData] = useState([]);
  const studentImage = data[0]?.studentImage;
  const studentName = data[0] ? `${data[0].firstName} ${data[0].lastName}` : "";
  const studentClass = data[0]?.className;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentList = await getStudentListByHomeworkId(homeworkId);
        const studentDetails = studentList.find(
          (student) => student.studentHomeworkId == studentHomeworkId
        );
        if (studentDetails) {
          const studentImageUrl = studentDetails.studentImageUrl;
          setData([{ ...studentDetails, studentImageUrl }]);
        } else {
          setData([]);
        }
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Download error: ", error.message);
      }
    };
    fetchData();
  }, [homeworkId, studentHomeworkId]);

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <h1>Öğrenci Bilgileri</h1>
        <div className="studenthomework-details-modal">
          {studentImage ? (
            <img
              className="student-image-modal"
              src={studentImage}
              alt="Öğrenci Resmi"
            />
          ) : (
            <FaUserCircle size={50} className="default-user-icon" />
          )}
          <div className="student-details-modal">
            <div className="student-name-modal">
              Adı Soyadı{" "}
              <span className="details-offset-name-modal">{studentName}</span>
              <img
                className="line"
                src={require("../../../assets/img/substract.png")}
                alt=""
              />
            </div>
            <div className="student-class-modal">
              Sınıfı
              <span className="details-offset-modal">
                {studentClass ? `${studentClass}` : "Sınıf bilgisi yok"}
              </span>
            </div>
          </div>
        </div>
        <span className="close-icon" onClick={onClose}>
          &times;
        </span>
        <button className="modal-close-button" onClick={onClose}>
          Geri Dön
        </button>
      </div>
    </div>
  );
};
const StudentHomeworkDetails = () => {
  const [data, setData] = useState([]);
  const { homeworkId, studentHomeworkId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInfoClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentList = await getStudentListByHomeworkId(homeworkId);
        setData(
          studentList.filter(
            (student) => student.studentHomeworkId == studentHomeworkId
          )
        );
      } catch (error) {
        console.error("Download error: ", error.message);
      }
    };
    fetchData();
    console.log(data);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentList = await getStudentListByHomeworkId(homeworkId);
        const studentDetails = studentList.find(
          (student) => student.studentHomeworkId == studentHomeworkId
        );
        if (studentDetails) {
          const studentImageUrl = studentDetails.studentImageUrl;
          setData([{ ...studentDetails, studentImageUrl }]);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Download error: ", error.message);
      }
    };
    fetchData();
  }, [homeworkId, studentHomeworkId]);

  const convertFileToUrl = (data, fileType) => {
    const blob = new Blob([data.data], { type: fileType });
    return URL.createObjectURL(blob);
  };

  //İndirme Fonksiyonu sonradan güncellenmeli
  const handleDownloadFile = async (filePath, studentHomeworkId) => {
    try {
      const fileResponse = await downloadFileStudentHomework(
        filePath,
        studentHomeworkId
      );
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

  if (!data || data.length === 0) {
    return <div>Veriler yükleniyor, Lütfen bekleyiniz.</div>;
  }
  const studentImage = data[0].studentImage;
  const studentName = data[0].firstName + " " + data[0].lastName;
  const studentClass = data[0].className;

  return (
    <div className="studenthomework-details-container">
      <h1 className="studenthomework-details-title">Ödev Detay</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      <div className="studenthomework-details-item">
        <div className="studenthomework-details-header">
          {studentImage ? (
            <img
              className="student-image"
              src={studentImage}
              alt="Öğrenci Resmi"
            />
          ) : (
            <FaUserCircle size={50} className="default-user-icon" />
          )}
          <div className="student-details">
            <div className="student-info">
              <div className="student-name">{studentName}</div>
              <div className="student-class">
                {studentClass ? `${studentClass}` : "Sınıf bilgisi yok"}
              </div>
            </div>
            <div className="info-icon-container" onClick={handleInfoClick}>
              <FaInfoCircle size={20} />
            </div>
          </div>
        </div>
        <span className="studenthomework-details-label">
          Eklenmiş Dosya Bilgisi:
          {data[0].attachedFile ? (
            <a
              href="#"
              onClick={() =>
                handleDownloadFile(data[0].attachedFile, studentHomeworkId)
              }>
              {data[0].attachedFile.split(".").pop() === "pdf" ? (
                <FaFilePdf size={28} style={{ verticalAlign: "middle" }} />
              ) : data[0].attachedFile.split(".").pop() === "zip" ? (
                <FaFileZipper size={28} style={{ verticalAlign: "middle" }} />
              ) : (
                <FaFile size={28} style={{ verticalAlign: "middle" }} />
              )}
            </a>
          ) : (
            <span className="details-offset">Yok</span>
          )}
        </span>
        <img
          className="line"
          src={require("../../../assets/img/substract.png")}
          alt=""
        />
      </div>
      <div className="studenthomework-details-item">
        <span className="studenthomework-details-label">
          Teslim Edildiği Tarih:{" "}
          {data[0].submitDate ? (
            formatDate(data[0].submitDate)
          ) : (
            <span className="details-offset">dd.MM.yyyy</span>
          )}
        </span>
        <img
          className="line"
          src={require("../../../assets/img/substract.png")}
          alt=""
        />
      </div>

      <div className="studenthomework-details-item">
        <span className="studenthomework-details-label">
          Geri Bildirim:{data[0].feedback}
        </span>
        <img
          className="line"
          src={require("../../../assets/img/substract.png")}
          alt=""
        />
        {/* <p>Buraya geri bildirim gelecek.</p> */}
      </div>
      <div className="form-buttons">
        <Link
          className="custom-cancel-button"
          to={`../../studenthomework/studentassigmentlist/${homeworkId}`}>
          Listeye Dön
        </Link>
      </div>
      <StudentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        studentName={studentName}
        studentClass={studentClass}
      />
    </div>
  );
};

export default StudentHomeworkDetails;
