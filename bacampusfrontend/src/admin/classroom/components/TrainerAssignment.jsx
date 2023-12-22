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
import DataTable from "../../../shared/data-table/DataTable";
import "react-toastify/dist/ReactToastify.css";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";
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
  getClasslessTrainers,
  getClassroomTrainers,
  addToClassroom,
  removeTrainerFromClassroom,
  updateClassroomAssignment,
} from "../api/assignmentApi";
import {getClassroomById} from"../api/classroomApi"
import { listAllTrainer } from "../../trainer/api/trainerApi";
import { useParams } from "react-router-dom";
import { MultipleAutoComplete } from "../components/MultipleAutoCompleteTrainer";

let savedData = sessionStorage.getItem("savedData");
if (sessionStorage.getItem("savedData") != null) {
  savedData = sessionStorage.getItem("savedData").split(",");
  const role = savedData[1];
}


function TrainerAssignment() {
  const [classroomTrainers, setClassroomTrainers] = useState([]);
  const [classlessTrainers, setClasslessTrainers] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [startDates, setStartDates] = useState({});
  const [endDates, setEndDates] = useState({});
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const { id } = useParams();
  const [trainers, setTrainers] = useState([]);
  const [trainersIds, setTrainersId] = useState([]);
  const [classroomName, setClassroomName] = useState("");
  const [apiMessageError, setApiMessageError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };


  useEffect(() => {
    // Fetch classless students when the component is mounted
    const fetchClassTrainersData = async () => {
      try {
        const data = await getClassroomTrainers(id);
        // Update the state with the fetched data
        setClassroomTrainers(data);
      } catch (error) {
        console.error("Classless students fetching error", error);
      }
    };

    // Call the fetchClassStudentsData function to load data on component mount
    fetchClassTrainersData();
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
        const data = await listAllTrainer();
        setTrainers(data);
      } catch (error) {
        console.error("Veriler alınırken hata oluştu", error);
      }
    };
    fetchData();
    setTrainersId(trainers.map((trainer) => trainer.id));
  }, []);
  
  useEffect(() => {
    const savedClassroom = sessionStorage.getItem("selectedClassroom");
    if (savedClassroom) {
      const classroom = JSON.parse(savedClassroom);
      setSelectedClassroom(classroom);
      fetchClassroomTrainers(id);
      fetchClasslessTrainers(id);
    }
  }, [id]);

  //Seçili öğrencilerin Id'sinin nin değişikliğini ele alır
  const handleTrainerIdSelecting = (trainersIds) => {
    setTrainersId(trainersIds);
  };
  const handleDropdownAction = (option, id, classroomId) => {
    if (option === "Güncelle") {
      handleUpdateDates(id, classroomId);
    }
  };

  const fetchClassroomTrainers = async (classroomId) => {
    getClassroomTrainers(classroomId)
      .then((response) => {
        setClassroomTrainers(response);
      })
      .catch((error) => console.error("Veriler alınırken hata oluştu ", error));
  };

  const fetchClasslessTrainers = async (classroomId) => {
    getClasslessTrainers(classroomId)
      .then((response) => {
        setClasslessTrainers(response);
      })
      .catch((error) =>
        console.error(
          "Sınıfı olmayan trainer verileri alınırken hata oluştu ",
          error
        )
      );
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
          removeTrainerFromClassroom
        );
        if (isSuccess) {
          const responce = await fetchClassroomTrainers(classroomId);
          
        }

      } else {
        console.error("Silinecek öğrenci bulunamadı");
      }
    } catch (error) {
      console.error("Eğitmen silme işlemi başarısız", error);
    }
  };

  const handleStartDateChange = (trainerId, date) => {
    setStartDates((prevStartDates) => ({
      ...prevStartDates,
      [trainerId]: date,
    }));
  };

  const handleEndDateChange = (trainerId, date) => {
    setEndDates((prevEndDates) => ({
      ...prevEndDates,
      [trainerId]: date,
    }));
  };

  const handleAddToClass = async (trainerId) => {
    if (!id) {
      // selectedClassroom null ise işlem yapma
      console.error("Sınıf seçilmedi.");
      return;
    }

    const startDate = startDates[id] || currentDate;
    const endDate = endDates[id] || null;

    if (trainersIds.length === 0) {
      setApiMessageError("Eğitmen bulunamadı.");
    }
    else{
      setApiMessageError("")
      setSuccessMessage("");
    } 

    for (const trainerId of trainersIds) {
      try {
        await addToClassroom(id, trainerId, startDate, endDate);

        // Eğitmen sınıfa eklenince, sınıf eğitmen listesini güncelleyin
        // Başarı bildirimi gösterin
        fetchClassroomTrainers(id);
        setSuccessMessage("");
        setSuccessMessage("Seçilen öğrenciler başarıyla sınıfa eklendi.")
      } catch (error) {
        console.error("Eğitmen sınıfa eklenirken hata:", error);
        // Hata oluştuğunda bir hata bildirimi gösterin
        setSuccessMessage("");
        setApiMessageError(error.response.data.message)
      }
    }

  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleUpdateDates = async (trainerId, classroomId) => {
    try {
      setSuccessMessage("");
    setApiMessageError("");
      const updateClassroomTrainerId = await deleteClassroomTrainer(
        trainerId,
        classroomId
      );

      const trainerDataResponse = await axios.get(
        `https://localhost:7247/api/Admin/ClassroomTrainers/GetById?id=${updateClassroomTrainerId}`,
        {
          headers: {
            Authorization: "Bearer " + savedData[0],
          },
        }
      );

      const trainerData = trainerDataResponse.data;

      const startDate = startDates[trainerId] || trainerData.data.startDate;
      const endDate = endDates[trainerId] || trainerData.data.endDate || null;

      const updateData = {
        id: updateClassroomTrainerId,
        trainerId: trainerId,
        classroomId: classroomId,
        startDate: startDate,
        endDate: endDate || null,
      };

      const response = await axios.put(
        `https://localhost:7247/api/Admin/ClassroomTrainers/Update`,
        updateData,
        {
          headers: {
            Authorization: "Bearer " + savedData[0],
          },
        }
      );

      fetchClassroomTrainers(id);

      if (response.data.isSuccess) {
        fetchClasslessTrainers(id);
        setSuccessMessage(response.data.message);
        
      } else {
        setSuccessMessage("");
        setApiMessageError("Tarih güncelleme işlemi başarısız")
      }
    } catch (error) {
      setApiMessageError(error.response.data.message)
    }
  };

  const filteredClassroomTrainers = classroomTrainers.filter((trainer) =>
    `${trainer.firstName} ${trainer.lastName}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const filteredClasslessTrainers = classlessTrainers.filter((trainer) =>
    `${trainer.firstName} ${trainer.lastName}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const [currentDate] = useState(new Date().toISOString().split("T")[0]);

  const handlePageChange = (event, { activePage }) => {
    setCurrentPage(activePage);
  };

  const classlessTable = <Table>{}</Table>;

  const columns = [
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
            <button onClick={() => handleDeleteTrainer(row.original.id, id)}>
              <BsTrash />
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header as="h1" style={{ color: "#337AB7" }}>
        {classroomName} Ait Eğitmen İşlemleri
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
        {trainers !== undefined && (
          <MultipleAutoComplete
            trainers={trainers}
            onTrainerIdSelecting={handleTrainerIdSelecting}
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
      {filteredClassroomTrainers.length===0 ? (
        <h3 style={{ textAlign: "center" }}>
        Bu gruba henüz eğitmen atanmamıştır.
      </h3>
        ) : (
        <DataTable columns={columns} data={filteredClassroomTrainers} />
      )}

      <ToastContainer />
    </>
  );
}

export default TrainerAssignment;
