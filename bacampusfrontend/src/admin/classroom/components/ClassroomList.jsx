import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  deleteClassroom,
  getAllBranchBy,
  getAllTrainingType,
  getClassrooms,
  getAllGroupTypeBy,
} from "../api/classroomApi";

import {
  getClassroomStudents,
  getClassroomTrainers,
} from "../api/assignmentApi";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";
import { BsChevronCompactDown, BsGear, BsTrash } from "react-icons/bs";
import DataTable from "../../../shared/data-table/DataTable";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import { getAllEducation } from "../../education/api/educationApi";
import { Button } from "semantic-ui-react";
import "../scss/ToolTip.scss";

function ClassroomList() {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [branchs, setbranchs] = useState([]);
  const [educations, setEducations] = useState([]);
  const [trainingTypes, setTraininigTypes] = useState([]);
  const [groupTypes, setgroupTypes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getClassrooms();
        setClassrooms(data);
        // formatData(data);
        const getBranchs = await getAllBranchBy();
        setbranchs(getBranchs);
        const getEducation = await getAllEducation();
        setEducations(getEducation);
        const getTrainingTypes = await getAllTrainingType();
        setTraininigTypes(getTrainingTypes);
        const getGroupTypes = await getAllGroupTypeBy();
        setgroupTypes(getGroupTypes);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Veriler alınırken hata oluştu", error);
      }
    }

    fetchData();
  }, []);

  const handleCreate = () => {
    navigate(`./classroomCreate`);
  };

  const handleClassroomSelect = (classroomId) => {
    const selected = classrooms.find(
      (classroom) => classroom.id === classroomId
    );
    setSelectedClassroom(selected);

    sessionStorage.setItem("selectedClassroom", JSON.stringify(selected));
  };

  const handleClassroomDelete = async (classroomId) => {
    const isSuccess = await DeleteItem(
      classroomId,
      deleteClassroom // apiden gelen silme fonksiyonu
    );

    if (isSuccess) {
      setClassrooms(
        classrooms.filter((classroom) => classroom.id !== classroomId)
      );
    }
  };

  const handleUpdate = (id) => {
    navigate(`./classroomUpdate/${id}`);
  };

  const handleDetail = (id) => {
    navigate(`./classroomdetail/${id}`);
  };

  const handleStudentAddTFromClassroom = (id) => {
    const selected = classrooms.find((classroom) => classroom.id === id);
    const groupName = selected ? selected.name : "Grup bulunamadı";
    navigate(`./studentassignment/${id}`);
  };
  const handleTrainerAddTFromClassroom = (id) => {
    const selected = classrooms.find((classroom) => classroom.id === id);
    const groupName = selected ? selected.name : "Grup bulunamadı";
    navigate(`./trainerassignment/${id}`);
  };

  const handleDropdownAction = (option, id) => {
    if (option === "Düzenle") {
      handleUpdate(id);
    } else if (option === "Öğrenci Ekle") {
      handleStudentAddTFromClassroom(id);
    } else if (option === "Eğitmen Ekle") {
      handleTrainerAddTFromClassroom(id);
    } else if (option === "Detay") {
      handleDetail(id);
    }
  };

  const columns = [
    {
      Header: "Grup Adı",
      accessor: "name",
      Cell: ({ value, row }) => {
        const [participantsData, setParticipantsData] = useState(null);

        useEffect(() => {
          const fetchData = async () => {
            try {
              const studentsResponse = await getClassroomStudents(row.original.id);
              const trainersResponse = await getClassroomTrainers(row.original.id);

              const students = studentsResponse || [];
              const trainers = trainersResponse || [];

              setParticipantsData({
                students,
                trainers,
              });
            } catch (error) {
              if (error.name === 'RedirectError') {
                navigate('/error'); // Redirect to ErrorPage
              } 
              console.error("Error fetching participants data", error);
            }
          };

          fetchData();
        }, [row.original.id]);

        return (
          <div>
            <div className="custom-tooltip">
              <span>{value}</span>
              <a>
                <div className="tooltiptext">
                  {participantsData ? (
                    <span className="content-text">
                      Öğrenciler
                      <br />
                      {participantsData.students.length > 0 ? (
                        participantsData.students.map((student, index) => (
                          <span key={index} className="title-text">
                            {index+1}- {student.firstName} {student.lastName}
                            {index < participantsData.students.length - 1 && <br />}
                          </span>
                        ))
                      ) : (
                        <span className="error-text">Sınıfa öğrenci atanmamış.</span>
                      )}
                      <br />
                      <br />
                      Eğitmenler
                      <br />
                      {participantsData.trainers.length > 0 ? (
                        participantsData.trainers.map((trainer, index) => (
                          <span key={index} className="title-text">
                            {index+1}- {trainer.firstName} {trainer.lastName}
                            {index < participantsData.trainers.length - 1 && <br />}
                          </span>
                        ))
                      ) : (
                        <span className="error-text">Sınıfa eğitmen atanmamış.</span>
                      )}
                    </span>
                  ) : (
                    <span className="error-text">Veri bulunamadı</span>
                  )}
                </div>
              </a>
            </div>
          </div>
        );
      },
    },

    {
      Header: "Bağlı Bulunduğu Eğitim",
      accessor: "educationId",
      Cell: ({ value }) =>
        educations.find((education) => education.id === value)?.name ||
        "Eğitim atanmamış",
    },
    {
      Header: "Başlangıç Tarihi",
      accessor: "openDate",
      Cell: ({ value }) => value.split("T")[0],
    },
    {
      Header: "Bitiş Tarihi",
      accessor: "closedDate",
      Cell: ({ value }) => value.split("T")[0],
    },
    {
      Header: "Grup Tipi",
      accessor: "groupTypeId",
      Cell: ({ value }) =>
        groupTypes.find((groupType) => groupType.id === value)?.name ||
        "Grup yok",
    },
    {
      Header: "Şube",
      accessor: "branchId",
      Cell: ({ value }) =>
        branchs.find((branch) => branch.id === value)?.name || "Şube yok",
    },
    {
      Header: "Eğitim Tipi",
      accessor: "trainingTypeId",
      Cell: ({ value }) =>
        trainingTypes.find((trainingType) => trainingType.id === value)?.name ||
        "Eğitim Tipi Yok",
    },
    {
      Header: "Durum",
      accessor: "status",
      Cell: ({ value }) => {
        return value === 4
          ? "Aktif"
          : value === 5
          ? "Pasif"
          : value === 1
          ? "Aktif"
          : value === 2
          ? "Aktif"
          : value === 3
          ? "Pasif"
          : "";
      },
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
              options={["Düzenle", "Detay", "Öğrenci Ekle", "Eğitmen Ekle"]}
              onOptionClick={(option) =>
                handleDropdownAction(option, row.original.id)
              }
            />
            <button onClick={() => handleClassroomDelete(row.original.id)}>
              <BsTrash />
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <h1>Gruplar</h1>
      <img className="line" src={require("../img/substract.png")} alt="" />
      <br />
      <Button className="btn-create" onClick={() => handleCreate()}>
        Ekle
      </Button>
      {Array.isArray(classrooms) && classrooms.length > 0 ? (
        <DataTable columns={columns} data={classrooms} />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz</p>
      )}
    </>
  );
}

export default ClassroomList;
