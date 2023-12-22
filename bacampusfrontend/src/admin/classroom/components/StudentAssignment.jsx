import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tab,
  Header,
  Input,
  Popup,
  Pagination,
  Image,
} from "semantic-ui-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";
import DataTable from "../../../shared/data-table/DataTable";
import axios from "axios";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import ToastContent from "../../../shared/toast-content/ToastContent";
import {
  BsAlignCenter,
  BsChevronCompactDown,
  BsGear,
  BsJustify,
  BsTrash,
} from "react-icons/bs";
import {
  getClasslessStudents,
  getClassroomStudents,
  addToClassroomStudent,
  removeStudentFromClassroom,
  getAllClassroomStudents,
  GetByIdForClassRoomStudent,
  updateClassroomAssignment,
  getAllForStudent,
  GetByIdForStudent,
} from "../api/assignmentApi";
import { getClassroomById } from "../api/classroomApi";
import { getAllStudents } from "../../student/api/studentApi";
import { useParams } from "react-router-dom";
import { MultipleAutoComplete } from "../components/MultipleAutoComplete";

let savedData = sessionStorage.getItem("savedData");
if (sessionStorage.getItem("savedData") != null) {
  savedData = sessionStorage.getItem("savedData").split(",");
  const role = savedData[1];
}

function StudentAssignment() {
  const [classroomStudents, setClassroomStudents] = useState([]);
  const [classlessStudents, setClasslessStudents] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [startDates, setStartDates] = useState({});
  const [endDates, setEndDates] = useState({});
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [studentsIds, setStudentsId] = useState([]);
  const [classroomName, setClassroomName] = useState("");
  const [apiMessageError, setApiMessageError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };

  useEffect(() => {
    // Fetch classless students when the component is mounted
    const fetchClassStudentsData = async () => {
      try {
        const data = await getClassroomStudents(id);
        // Update the state with the fetched data
        setClassroomStudents(data);
      } catch (error) {
        console.error("Classless students fetching error", error);
      }
    };

    // Call the fetchClassStudentsData function to load data on component mount
    fetchClassStudentsData();
  }, [id]);

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        const classroomData = await getClassroomById(id); // Replace 'id' with the actual classroom ID you want to fetch.
        if (classroomData) {
          const classroomName = classroomData.data.name;
          setClassroomName(classroomName);
        } else {
          console.error("Classroom not found or an error occurred.");
        }
      } catch (error) {
        console.error("Error fetching classroom data:", error);
      }
    };

    // Call the fetchClassroomData function to load classroom data on component mount or as needed.
    fetchClassroomData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllStudents();
        setStudents(data);
      } catch (error) {
        console.error("Veriler alınırken hata oluştu", error);
      }
    };
    fetchData();
    setStudentsId(students.map((student) => student.id));
  }, []);

  useEffect(() => {
    const savedClassroom = sessionStorage.getItem("selectedClassroom");
    if (savedClassroom) {
      const classroom = JSON.parse(savedClassroom);
      setSelectedClassroom(classroom);
      fetchClassroomStudents(id);
      fetchClasslessStudents(id);
    }
  }, [id]);

  //Seçili öğrencilerin Id'sinin nin değişikliğini ele alır
  const handleStudentIdSelecting = (studentsIds) => {
    setStudentsId(studentsIds);
  };
  const handleDropdownAction = (option, id, classroomId) => {
    if (option === "Güncelle") {
      handleUpdateDates(id, classroomId);
    }
  };

  const fetchClassroomStudents = (classroomId) => {
    getClassroomStudents(classroomId)
      .then((response) => {
        setClassroomStudents(response);
      })
      .catch((error) => console.error("Veriler alınırken hata oluştu ", error));
  };

  const fetchClasslessStudents = (classroomId) => {
    getClasslessStudents(classroomId)
      .then((response) => {
        setClasslessStudents(response);
      })
      .catch((error) =>
        console.error(
          "Sınıfı olmayan student verileri alınırken hata oluştu ",
          error
        )
      );
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
          removeStudentFromClassroom
        );
        if (isSuccess) {
          fetchClassroomStudents(classroomId);
        }
      } else {
        console.error("Silinecek öğrenci bulunamadı");
      }
    } catch (error) {
      console.error("Öğrenci silme işlemi başarısız", error);
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

  const handleAddToClass = async () => {
    if (!id) {
      // selectedClassroom null ise işlem yapma
      console.error("Sınıf seçilmedi.");
      return;
    }

    const startDate = startDates[id] || currentDate;
    const endDate = endDates[id] || null;

    if (studentsIds.length === 0) {
      setApiMessageError("Öğrenci bulunamadı.")
    }
    else{
      setApiMessageError("")
      setSuccessMessage("");
    }  
    // Seçilen her öğrenciyi sınıfa ekleyin
    for (const studentId of studentsIds) {
      try {
        await addToClassroomStudent(id, studentId, startDate, endDate);

        // Öğrenci sınıfa eklenince, sınıf öğrenci listesini güncelleyin
        fetchClassroomStudents(id);
        
        setSuccessMessage("");
        setSuccessMessage("Seçilen öğrenciler başarıyla sınıfa eklendi.")
      } catch (error) {
        console.error("Öğrenci sınıfa eklenirken hata:", error);
        // Hata oluştuğunda bir hata bildirimi gösterin
        setSuccessMessage("");
        setApiMessageError(error.response.data.message)
      }
    }

  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };
  //const studentData = await GetByIdForStudent(updateClassroomStudentId);
  const handleUpdateDates = async (studentId, classroomId) => {
    try {
      setSuccessMessage("");
    setApiMessageError("");
      const updateClassroomStudentId = await deleteClassroomStudent(
        studentId,
        classroomId
      );

      const studentDataResponse = await GetByIdForClassRoomStudent(
        updateClassroomStudentId
      );

      const studentData = studentDataResponse;

      const startDate = startDates[studentId] || studentData.startDate||studentDataResponse.startDate;
      const endDate = endDates[studentId] || studentData.endDate || null;

      const updateData = {
        id: updateClassroomStudentId,
        studentId: studentId,
        classroomId: classroomId,
        startDate: startDate,
        endDate: endDate,
      };

      const response = await updateClassroomAssignment(
        updateData
      );
      
      if (response.isSuccess) {
        fetchClassroomStudents(id);
        setSuccessMessage(response.message);
        
      } else {
        setSuccessMessage("");
        setApiMessageError("Tarih güncelleme işlemi başarısız")
      }
    } catch (error) {
      setApiMessageError(error.response.data.message)
    }
    
  };

  const filteredClassroomStudents = classroomStudents.filter((student) =>
    `${student.firstName} ${student.lastName}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const filteredClasslessStudents = classlessStudents.filter((student) =>
    `${student.firstName} ${student.lastName}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const [currentDate] = useState(new Date().toISOString().split("T")[0]);

  const handlePageChange = (event, { activePage }) => {
    setCurrentPage(activePage);
  };

  const columns = [
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
        <div>
          <div className="buttons">
            <Dropdown
              triggerText={
                <span>
                  <BsGear />
                  <BsChevronCompactDown />
                </span>
              }
              options={["Güncelle"]}
              onOptionClick={() =>
                handleDropdownAction("Güncelle", row.original.id, id)
              }
            />
            <button onClick={() => handleDeleteStudent(row.original.id, id)}>
              <BsTrash />
            </button>
          </div>
        </div>
      ),
    },
  ];
  const classlessTable = <Table>{}</Table>;

  return (
    <>
      <Header as="h1" style={{ color: "#337AB7" }}>
        {classroomName} Ait Öğrenci İşlemleri
      </Header>
      <Image className="line" src={require("../img/substract.png")} />
      <Header as="h3">
        {selectedClassroom !== null
          ? `Sınıf / ${selectedClassroom.name}  (${
              selectedClassroom.openDate.split("T")[0]
            } / ${selectedClassroom.closedDate.split("T")[0]})`
          : ""}
      </Header>
      <div className="table-add">
        {students !== undefined && (
          <MultipleAutoComplete
            students={students}
            onStudentIdSelecting={handleStudentIdSelecting}
          />
        )}
        <button className="btn-create" onClick={handleAddToClass}>
          Ekle
        </button>
      </div>
      {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}
      <br />
      <br />
      {filteredClassroomStudents.length === 0 ? (
        <h3 style={{ textAlign: "center" }}>
          Bu gruba henüz öğrenci atanmamıştır.
        </h3>
      ) : (
        <DataTable columns={columns} data={filteredClassroomStudents} />
      )}

      <ToastContainer />
    </>
  );
}

export default StudentAssignment;
