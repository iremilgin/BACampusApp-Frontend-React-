import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getClassroomById, getAllBranchBy, getAllGroupTypeBy, getAllTrainingType, getTrainersByClassroomId, getStudentsByClassroomId } from "../api/classroomApi";
import { getAllEducation } from "../../education/api/educationApi";
import "../scss/ClassroomDetail.scss";
import {
  Image,
  Table,
  Input
} from "semantic-ui-react";
import DataTable from "../../../shared/data-table/DataTable";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import {
  BsChevronCompactDown,
  BsGear,
  BsTrash,
} from "react-icons/bs";
import {
  removeStudentFromClassroom,
  getAllClassroomStudents,
  removeTrainerFromClassroom,
} from "../api/assignmentApi";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";
import axios from "axios";
import { useNavigate } from "react-router-dom";

let savedData = sessionStorage.getItem("savedData");
if (sessionStorage.getItem("savedData") != null) {
  savedData = sessionStorage.getItem("savedData").split(",");
  const role = savedData[1];
}

const ClassroomDetail = () => {
  const [classroom, setClassroom] = useState(null);
  const [edications, setEducationList] = useState([]);
  const [branchs, setBranchList] = useState([]);
  const [groups, setGroupTypeList] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [students, setStudents] = useState([]);
  const [startDates, setStartDates] = useState({});
  const [endDates, setEndDates] = useState({});

  const [trainingTypeList, setTrainingTypeList] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListData() {
      const getEducation = await getAllEducation();
      setEducationList(getEducation);
      const getBranchs = await getAllBranchBy();
      setBranchList(getBranchs);
      const getTrainingTypes = await getAllTrainingType();
      setTrainingTypeList(getTrainingTypes);
      const getGroupTypes = await getAllGroupTypeBy();
      setGroupTypeList(getGroupTypes);
    }
    fetchListData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const classroom = await getClassroomById(id);
        setClassroom(classroom.data);

        const trainersResult = await getTrainersByClassroomId(id);
        setTrainers(trainersResult.data);

        const studentList = await getStudentsByClassroomId(id);
        setStudents(studentList.data);

      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Error fetching classroom details:", error);
      }
    };
    fetchData();
  }, [id]);

  if (!classroom) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Tarih bulunamadı";
    }

    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Intl.DateTimeFormat("tr-TR", options).format(
      new Date(dateString)
    );
  };

  const handleUpdateTrainer = (trainerid) => {
    navigate(`../../../admin/trainer/trainerupdate/${trainerid}`);
  }

  const handleUpdateStudent = (studentid) => {
    navigate(`../../../admin/student/studentupdate/${studentid}`);
  }

  const handleDropdownActionTrainer = (option, trainerid) => {
    if (option === "Düzenle") {
      handleUpdateTrainer(trainerid);
    }
  };

  const handleDropdownActionStudent = (option, studentid) => {
    if (option === "Düzenle") {
      handleUpdateStudent(studentid);
    }
  };

  const deleteClassroomStudent = async (studentId, classroomId) => {
    try {
      const response = await getAllClassroomStudents();

      const studentToDelete = response.find((item) => {
        return item.classroomId === classroomId && item.studentId === studentId;
      });

      if (studentToDelete) {
        const classroomStudentId = studentToDelete.id;
        return classroomStudentId;
      } else {
        console.error("Silinecek öğrenci bulunamadı");
        return null;
      }
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Silme başarısız", error);
      return 1;
    }
  };

  const handleDeleteStudent = async (studentId, classroomId) => {
    try {
      const deleteClassroomStudentId = await deleteClassroomStudent(
        studentId,
        classroomId
      );

      if (deleteClassroomStudentId) {
        const isSuccess = await DeleteItem(
          deleteClassroomStudentId,
          removeStudentFromClassroom,
        );
      } else {
        console.error("Student to delete not found");
      }
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Error deleting student:", error);
    }
  };

  const deleteClassroomTrainer = async (trainerId, classroomId) => {
    try {
      const response = await axios.get(
        `https://localhost:7247/api/Admin/ClassroomTrainers/GetAll`,
        {
          headers: {
            Authorization: "Bearer " + savedData[0],
          },
        }
      );

      const trainerToDelete = response.data.data.find((item) => {
        return item.classroomId === classroomId && item.trainerId === trainerId;
      });

      if (trainerToDelete) {
        const classroomTrainerId = trainerToDelete.id;
        return classroomTrainerId;
      } else {
        console.error("Silinecek eğitmen bulunamadı");
        return null;
      }
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Silme başarısız", error);
      return 1;
    }
  };

  const handleDeleteTrainer = async (trainerId, classroomId) => {
    try {
      const deleteClassroomTrainerId = await deleteClassroomTrainer(
        trainerId,
        classroomId
      );

      if (deleteClassroomTrainerId) {
        const isSuccess = await DeleteItem(
          deleteClassroomTrainerId,
          removeTrainerFromClassroom,
          );
        } else {
          console.error("Silinecek öğrenci bulunamadı");
        }
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      console.error("Eğitmen silme işlemi başarısız", error);
    }
  };

  const handleStartDateChange = (studentId, date) => {
    setStartDates((prevStartDates) => ({
      ...prevStartDates,
      [studentId]: date,
    }));
  };

  const handleEndDateChange = (studentId, date) => {
    setEndDates((prevEndDates) => ({
      ...prevEndDates,
      [studentId]: date,
    }));
  };

  const trainer = [
    {
      Header: "Profil Fotoğrafı",
      accessor: "image",
      Cell: () => (
        <Image src={require("../img/avatar.png")} rounded size="mini" />
      ),
    },

    {
      Header: "Eğitmen Adı",
      accessor: (row) => `${row.firstName} ${row.lastName}`,
    },

    {
      Header: "Telefon",
      accessor: "phoneNumber",
    },
    {
      Header: "E-Mail",
      accessor: "email",
    },
    {
      Header: "Başlangıç Tarihi",
      accessor: "startDate",
      Cell: ({ row }) => (
        <Table.Cell>
          <Input
            type="date"
            value={
              startDates[row.original.id] ||
              (row.original.startDate === null
                ? null
                : row.original.startDate.split("T")[0])
            }
            onChange={(event) =>
              handleStartDateChange(row.original.id, event.target.value)
            }
          />
        </Table.Cell>
      ),
    },
    {
      Header: "Bitiş Tarihi",
      accessor: "endDate",
      Cell: ({ row }) => (
        <Table.Cell>
          <Input
            type="date"
            value={
              endDates[row.original.id] ||
              (row.original.endDate === null
                ? null
                : row.original.endDate.split("T")[0])
            }
            onChange={(event) =>
              handleEndDateChange(row.original.id, event.target.value)
            }
            onClear={() => {
              handleEndDateChange(row.original.id, null);
            }}
          />
        </Table.Cell>
      ),
    },
    {
      Header: "İşlemler",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="buttons">
          <Dropdown
            triggerText={
              <span>
                <BsGear />
                <BsChevronCompactDown />
              </span>
            }
            options={["Düzenle"]}
            onOptionClick={(option) =>
              handleDropdownActionTrainer(option, row.original.id)
            }
          />
          <button>
            <BsTrash onClick={() => handleDeleteTrainer(row.original.id, id)}/>
          </button>
        </div>
      ),
    },]

  const student = [
    {
      Header: "Profil Fotoğrafı",
      accessor: "image",
      Cell: () => (
        <Image src={require("../img/avatar.png")} rounded size="mini" />
      ),
    },

    {
      Header: "Öğrenci Adı",
      accessor: (row) => `${row.firstName} ${row.lastName}`,
    },

    {
      Header: "Telefon",
      accessor: "phoneNumber",
    },
    {
      Header: "E-Mail",
      accessor: "email",
    },
    {
      Header: "Başlangıç Tarihi",
      accessor: "startDate",
      Cell: ({ row }) => (
        <Table.Cell>
          <Input
            type="date"
            value={
              startDates[row.original.id] ||
              (row.original.startDate === null
                ? null
                : row.original.startDate.split("T")[0])
            }
            onChange={(event) =>
              handleStartDateChange(row.original.id, event.target.value)
            }
          />
        </Table.Cell>
      ),
    },
    {
      Header: "Bitiş Tarihi",
      accessor: "endDate",
      Cell: ({ row }) => (
        <Table.Cell>
          <Input
            type="date"
            value={
              endDates[row.original.id] ||
              (row.original.endDate === null
                ? null
                : row.original.endDate.split("T")[0])
            }
            onChange={(event) =>
              handleEndDateChange(row.original.id, event.target.value)
            }
            onClear={() => {
              handleEndDateChange(row.original.id, null);
            }}
          />
        </Table.Cell>
      ),
    }, 
    {
      Header: "İşlemler",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="buttons">
          <Dropdown
            triggerText={
              <span>
                <BsGear />
                <BsChevronCompactDown />
              </span>
            }
            options={["Düzenle"]}
            onOptionClick={(option) =>
              handleDropdownActionStudent(option, row.original.id)
            }
          />
          <button>
            <BsTrash onClick={() => handleDeleteStudent(row.original.id, id)}/>
          </button>
        </div>
      ),
    },]

  return (
    <div className="homework-form-container">
      <h1>Grup Detay</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      <form className="card-body">
        <div className="form-field">
          <div className="form-field">
            <label className="form-label">İsim :</label>
            <span className="form-label-answers">{classroom.name}</span>

            {/* <span className="form-label-answers">{classroom.name}</span> */}
          </div>
          <div className="form-field">
            <label className="form-label">Bulunduğu Eğitim :</label>
            <span className="form-label-answers">
              {edications.find(
                (education) => education.id === classroom.educationId
              )?.name || "Eğitim atanmamış"}
            </span>
          </div>
        </div>

        <div className="form-field">
          <div className="form-field">
            <label className="form-label">Başlangıç Tarihi :</label>
            <span className="form-label">{formatDate(classroom.openDate)}</span>
          </div>

          <div className="form-field">
            <label className="form-label ">Bitiş Tarihi :</label>
            <span className="form-label">
              {formatDate(classroom.closedDate)}
            </span>
          </div>
        </div>
        <div className="form-field">
          <div className="form-field">
            <label className="form-label">Şube :</label>
            <span className="form-label">
              {branchs.find((branch) => branch.id === classroom.branchId)
                ?.name || "Eğitim atanmamış"}
            </span>
          </div>
          <div className="form-field">
            <label className="form-label">Grup Tipi :</label>
            <span className="form-label">
              {groups.find((groupType) => groupType.id === classroom.groupTypeId)
                ?.name || "Grup atanmamış"}
            </span>
          </div>

        </div>
        <div className="form-field">
          <label className="form-label">Eğitim Tipi :</label>
          <span className="form-label">
            {trainingTypeList.find((trainingType) => trainingType.id === classroom.trainingTypeId)
              ?.name || "Eğitim Tipi atanmamış"}
          </span>
        </div>

        <br></br>

        <img
          className="line"
          src={require("../../../assets/img/substract.png")}
          alt=""
        />

      </form>
      <label className="classroomdetail-label">Eğitmenler</label>
        {trainers.length === 0 ? (
          <h3 style={{ textAlign: "center" }}>
            Bu gruba henüz eğitmen atanmamıştır.
          </h3>
        ) : (
          <DataTable columns={trainer} data={trainers} handleEdit={handleUpdateTrainer} />
        )}

        <label className="classroomdetail-label">Öğrenciler</label>
        {students.length === 0 ? (
          <h3 style={{ textAlign: "center" }}>
            Bu gruba henüz öğrenci atanmamıştır.
          </h3>
        ) : (
          <DataTable columns={student} data={students} handleEdit={handleUpdateStudent}/>
        )}
    </div>
  );
};

export default ClassroomDetail;
