import "../../trainer/scss/button.scss";
import { createHomework, studentHomeworkCreate } from "../Api/HomeworkApi";
import { listAllSubject } from "../../subject/api/subjectApi";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MultipleAutoComplete } from "../components/MultipleAutoComplete";
import { ControlledSwitches } from "../components/Switch ";
import { ComboBox } from "../components/ComboBox";
import { getClassrooms } from "../../classroom/api/classroomApi";
import { getClassroomStudents } from "../../classroom/api/assignmentApi";
import Checkbox from "@mui/material/Checkbox";
import ToastContent from "../../../shared/toast-content/ToastContent";

const HomeworkAdd = () => {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [description, setDescription] = useState("");
  const [referenceFile, setReferenceFile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [isLateTurnedIn, setIsLateTurnedIn] = useState(false);
  const [isHasPoint, setIsHasPoint] = useState(false);

  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [classroomId, setClassroomId] = useState("");
  const [students, setStudents] = useState([]);
  const [studentsIds, setStudentsId] = useState([]);
  const [classroomState, setClassroomState] = useState("");

  const [titleError, setTitleError] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [intructionsError, setIntructionsError] = useState("");

  const [apiMessageError, setApiMessageError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  //Switch in değişikliğini ele alır
  const handleSwitchChange = (isChecked) => {
    setIsChecked(isChecked);
  };
  //ClassroomId nin değişikliğini ele alır
  const handleClassroomIdChange = (classroomId) => {
    setClassroomId(classroomId);
  };

  //Seçili öğrencilerin Id'sinin nin değişikliğini ele alır
  const handleStudentIdSelecting = (studentsIds) => {
    setStudentsId(studentsIds);
  };

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

  //Öğrenciye ödev atamasını gerçekleştiren fonksiyon
  async function studenthomeworkAndHomeworkCreate(formData) {
    try {
      const response = await createHomework(formData);
      let homeworkId = response.data.data.id;
      const datas = [];
      studentsIds.forEach((newstudentId) => {
        const newData = {
          homeworkId: homeworkId,
          studentId: newstudentId,
        };
        datas.push(newData);
      });
      if (datas.length > 0) {
        const studenthomework = await studentHomeworkCreate(datas);
        const message = studenthomework.data.message;
        setSuccessMessage(message);
        showToast(message, "success");
        setTimeout(() => {
          navigate("../../homework");
        }, 2000);
      } else {
        students
          .map((student) => student.id)
          .forEach((id) => {
            let data = {
              homeworkId: homeworkId,
              studentId: id,
            };
            datas.push(data);
          });
        const studenthomework = await studentHomeworkCreate(datas);
        const message = studenthomework.data.message;
        setSuccessMessage(message);
        showToast(message, "success");
        setTimeout(() => {
          navigate("../../homework");
        }, 2000);
      }
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
      if (error.errorMessages.Intructions) {
        setIntructionsError(error.errorMessages.Intructions);
      } else {
        setIntructionsError("");
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
  }

  //Formun submit edilmesini ele alır
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Intructions", instructions);
    formData.append("ReferanceFile", referenceFile);
    formData.append("StartDate", startDate);
    formData.append("EndDate", endDate);
    formData.append("SubjectId", subjectId);
    formData.append("IsLateTurnedIn", isLateTurnedIn);
    formData.append("IsHasPoint", isHasPoint);
    formData.append("Description", description);
    formData.append("ClassroomId", classroomId);

    if (!isChecked) {
      if (classroomState == "dolu") {
        if (studentsIds.length > 0) {
          studenthomeworkAndHomeworkCreate(formData);
        } else {
          setWarningMessage("Lütfen bir öğrenci seçiniz!");
        }
      } else if (classroomState === "boş")
        setWarningMessage("Sınıfa atanmış bir öğrenci olmadığı için oluşturulmuş ödeve atama gerçekleştirilemez!");
    } else {
      if (classroomState == "dolu") {
        studenthomeworkAndHomeworkCreate(formData);
      } else if (classroomState === "boş")
        setWarningMessage("Sınıfa atanmış bir öğrenci olmadığı için oluşturulmuş ödeve atama gerçekleştirilemez!");
    }
  };

  //Konular Listelenir
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

  //Sınıflar Listelenir
  useEffect(() => {
    getClassrooms()
      .then((data) => {
        setClassrooms(data);
      })
      .catch((error) => {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } else {
          console.error("Veriler alınırken hata oluştu: ", error);
        }
      });
  }, []);

  //Sınıflar değiştikçe sınıfın doluluk verilerinin alınması ve seçilen öğrencilerinin set edilmesi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getClassroomStudents(classroomId);
        setStudents(data);
        data.length == 0 ? setClassroomState("boş") : setClassroomState("dolu");
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Veriler alınırken hata oluştu", error);
      }
    };
    fetchData();
    setStudentsId(students.map((student) => student.id));
  }, [classroomId]);

  return (
    <div className="homework-form-container">
      <h1>Ödev Ekle</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-field">
          <label htmlFor="title" className="form-label">
            Başlık:
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
                <label htmlFor="startDate" className="form-label" style={{marginRight:"20px"}}>
                  Başlangıç Tarihi:
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="form-input calender"
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
                  Bitiş Tarihi:
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
            Konu Seç:
          </label>
          <select
            id="subjectId"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            required
            className="form-input"
          >
            <option value="" disabled>
              Seçiniz
            </option>
            {subjects.length > 0 &&
              subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
          </select>
          <label htmlFor="referenceFile" className="form-label right-label">
            Referans Dosya:
          </label>
          <input
            type="file"
            id="referenceFile"
            onChange={(e) => setReferenceFile(e.target.files[0])}
            className="form-input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="instructions" className="form-label textarea" >
            Talimatlar:
          </label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            rows="5"
            className="form-input"
            style={{ fontFamily: "CustomFont", fontSize: "12.18px" }}
          />
        </div>
        <div>
          {intructionsError && (
            <div className="error-message">{intructionsError}</div>
          )}
        </div>
        <div className="otherinformation">
          <div className="form-checkbox">
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

          <div className="form-checkbox">
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
        <div className="extra-body">
          <div className="extra-field">
            <ControlledSwitches onSwitchChange={handleSwitchChange} />
          </div>
          <div className="extra-field-two">
            <div className="form-field">
              <ComboBox
                classrooms={classrooms}
                onClassroomIdChange={handleClassroomIdChange}
              />
              {!isChecked && (
                <MultipleAutoComplete
                  students={students}
                  onStudentIdSelecting={handleStudentIdSelecting}
                />
              )}
            </div>
            {/* {!isChecked && <MultiLineTextBox />} */}
            <div className="form-field">
              <textarea
                placeholder="Açıklama..."
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="5"
                className="form-textarea extra"
              />
            </div>
          </div>
        </div>
        

        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}
        {showToast(warningMessage, "warning")}

        <div className="buttons-form">
          <input type="submit" value="Ekle" className=" submit-button" />
          <Link className="submit-button backto-list" to={"/admin/homework"}>
            Listeye Dön
          </Link>
        </div>
      </form>
    </div>
  );
};

export default HomeworkAdd;
