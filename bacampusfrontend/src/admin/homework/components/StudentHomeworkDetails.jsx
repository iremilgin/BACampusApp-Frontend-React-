import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  downloadFileStudentHomework,
  getStudentListByHomeworkId,
  getStudentById,
  getStudentHomeworkById,
} from "../Api/HomeworkApi";
//alttakiyle değiştirildi import "../../../trainer/homework/scss/StudentHomeworkDetails.scss";
import "../scss/StudentHomeworkDetails.scss";
import { FaFilePdf, FaFileZipper, FaFile } from "react-icons/fa6";
import { FaUserCircle, FaInfoCircle } from "react-icons/fa";
import { BsXCircle } from "react-icons/bs";
import { getClassrooms } from "../../classroom/api/classroomApi";

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
  const [studentData, setStudentData] = useState([]);
  const studentImage = studentData?.image;
  const studentName = studentData ? `${studentData.firstName} ${studentData.lastName}` : "";
  const studentClass = studentData?.classroomId;
  const studentTelephone = studentData?.phoneNumber;
  const studentEmail = studentData?.email;
  const studentBirthday = new Date(studentData?.dateOfBirth).toLocaleDateString();
  const studentGender = studentData?.gender ? "Erkek" : "Kadın";
  // const [studentId, setStudentId] = useState([]);
  const [classroom, setClassroom] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentList = await getStudentHomeworkById(studentHomeworkId);
        console.log("--------------", studentList);
        // const studentDetails = studentList.find(
        //   (student) => student.studentHomeworkId == studentHomeworkId
        // );

        // const studentImageUrl = studentDetails.studentImageUrl;
        // setStudentId([{ ...studentDetails, studentImageUrl }]);

        const studentId = studentList.data.studentId;
        // getStudentById fonksiyonuyla öğrenci bilgilerini al
        const studentInfo = await getStudentById(studentId);
        setClassroom(studentList.data.classroomName);
        setStudentData(studentInfo.data);
        console.log("data", studentData);
        // studentInfo içinde öğrenci bilgileri olacak
        console.log("studentinfo", studentInfo.data);
      } catch (error) {
        if (error.name === "RedirectError") {
          navigate("/error"); // Redirect to ErrorPage
        }
        console.error("Download error: ", error.message);
      }
    };
    fetchData();
  }, [homeworkId, studentHomeworkId]);

  const line = (
    <img
      className="line"
      src={require("../../../assets/img/substract.png")}
      alt=""
    />
  );

  // const fetchClassromData = async () => {
  //   try {
  //     const response = await getClassrooms();
  //     setClassrooms(response);
  //   } catch (error) {
  //     console.error("Sınıflar alınırken hata oluştu: ", error);
  //   }
  //   fetchClassromData();
  // };

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
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
          <div className="details-student-info-container">
            <div className="details-student-info">
              <div className="student-details-modal">
                <div className="student-name-modal">
                  <label className="details-student-info-label">
                    Adı Soyadı :
                  </label>
                  <span className="details-student-info">{studentName}</span>
                </div>
                <div className="splitLine"></div>
                <div className="student-subname-modal">
                  <label className="details-student-info-label">Sınıfı :</label>
                  <span className="details-student-info">
                    {classroom || "Sınıf Yok"}
                    {/* {(value) =>
                      classrooms.find((classroom) => classroom.id === value)
                        ?.name || "Sınıf yok"
                    } */}
                    {/* {studentClass ? `${studentClass}` : "Sınıf bilgisi yok"} */}
                  </span>
                </div>
                <div className="splitLine"></div>
                <div className="student-subname-modal">
                  <label className="details-student-info-label">
                    Telefon Numarası :
                  </label>
                  <span className="details-student-info">
                    {studentTelephone
                      ? `${studentTelephone}`
                      : "Telefon bilgisi yok"}
                  </span>
                </div>
                <div className="splitLine"></div>
                <div className="student-subname-modal">
                  <label className="details-student-info-label">E-Mail :</label>
                  <span className="details-student-info">
                    {studentEmail ? `${studentEmail}` : "Email bilgisi yok"}
                  </span>
                </div>
                <div className="splitLine"></div>
                <div className="" />
                <div className="student-subname-modal">
                  <label className="details-student-info-label">
                    Doğum Tarihi :
                  </label>
                  <span className="details-student-info">
                    {studentBirthday
                      ? `${studentBirthday}`
                      : "Doğum tarihi bilgisi yok"}
                  </span>
                </div>
                <div className="splitLine"></div>
                <div className="student-subname-modal">
                  <label className="details-student-info-label">
                    Cinsiyet :
                  </label>
                  <span className="details-student-info">
                    {studentGender
                      ? `${studentGender}`
                      : "Cinsiyet bilgisi yok"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BsXCircle className="close-icon" onClick={onClose}>
          &times;
        </BsXCircle>
        <button className="modal-close-button" onClick={onClose}>
          Geri Dön
        </button>
      </div>
    </div>
  );
};
const StudentHomeworkDetails = () => {
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const { homeworkId, studentHomeworkId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classRoom,setClassRoom] = useState("");
  const handleInfoClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const studentList = await getStudentListByHomeworkId(homeworkId);
  //       setData(
  //         studentList.filter(
  //           (student) => student.studentHomeworkId == studentHomeworkId
  //         )
  //       );
  //     } catch (error) {
  //       console.error("Download error: ", error.message);
  //     }
  //   };
  //   fetchData();
  //   console.log(data);
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentList = await getStudentListByHomeworkId(homeworkId);
        const studentData = await getStudentHomeworkById(studentHomeworkId);
        const studentDetails = studentList.find(
          (student) => student.studentHomeworkId == studentHomeworkId
        );
        if (studentDetails) {
          const studentImageUrl = studentDetails.studentImageUrl;
          setData([{ ...studentDetails, studentImageUrl }]);
          setClassRoom(studentData.data.classroomName);
          const studentId = studentDetails.studentId;
          const studentInfo = await getStudentById(studentId);
          setUserData(studentInfo.data);
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
  const studentImage = userData.image;
  const studentName = userData.firstName + " " + userData.lastName;
  const studentClass = userData.classroomName;

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
                {classRoom ? `${classRoom}` : "Sınıf bilgisi yok"}
              </div>
            </div>
            <div className="info-icon-container" onClick={handleInfoClick}>
              <FaInfoCircle size={20} />
            </div>
          </div>
        </div>
      </div>

      <table className="studenthomework-details-item">
        <tr>
          <td className="studenthomework-details-label">
            Eklenmiş Dosya Bilgisi:
          </td>
          <td className="studenthomework-details-value">
            {data[0].attachedFile ? (
              <a
                href="#"
                onClick={() =>
                  handleDownloadFile(data[0].attachedFile, studentHomeworkId)
                }
              >
                {data[0].attachedFile.split(".").pop() === "pdf" ? (
                  <FaFilePdf size={28} style={{ verticalAlign: "middle" }} />
                ) : data[0].attachedFile.split(".").pop() === "zip" ? (
                  <FaFileZipper size={28} style={{ verticalAlign: "middle" }} />
                ) : (
                  <FaFile size={28} style={{ verticalAlign: "middle" }} />
                )}
              </a>
            ) : (
              <td className="details-offset">Yok</td>
            )}
          </td>
        </tr>
        <img
          className="line"
          src={require("../../../assets/img/substract.png")}
          alt=""
        />

        <tr>
          <td className="studenthomework-details-label">
            Teslim Edildiği Tarih:
          </td>
          <td className="studenthomework-details-value">
            {data[0].submitDate ? (
              formatDate(data[0].submitDate)
            ) : (
              <td className="details-offset">dd.MM.yyyy</td>
            )}
          </td>
        </tr>
        <img
          className="line"
          src={require("../../../assets/img/substract.png")}
          alt=""
        />

        <tr>
          <td className="studenthomework-details-label">Geri Bildirim:</td>
          <td className="studenthomework-details-value">{data[0].feedback}</td>
        </tr>
        <img
          className="line"
          src={require("../../../assets/img/substract.png")}
          alt=""
        />
      </table>

      <div className="form-buttons">
        <Link
          className="custom-cancel-button"
          to={`../../studenthomework/studentassigmentlist/${homeworkId}`}
        >
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
