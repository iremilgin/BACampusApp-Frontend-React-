import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  deleteClassroom,
  GetActiveClassroomsByEducationId,
} from "../../classroom/api/classroomApi";
import {
  getClassroomStudents,
  getClassroomTrainers,
} from "../../classroom/api/assignmentApi";
import { DeleteItem } from "../../../shared/delete-alerts/DeleteAlert";
import { BsChevronCompactDown, BsGear, BsTrash } from "react-icons/bs";
import DataTable from "../../../shared/data-table/DataTable";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import { Button } from "semantic-ui-react";
import "../../classroom/scss/ToolTip.scss";

function EducationGroupList() {
  const { id } = useParams();
  const [classrooms, setClassrooms] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await GetActiveClassroomsByEducationId(id);
        setClassrooms(data.data);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        console.error("Veriler alınırken hata oluştu", error);
      }
    }

    fetchData();
  }, [id]);

  const handleCreate = () => {
    navigate(`../../classroom/classroomcreate`);
  };

  const handleClassroomDelete = async (classroomId) => {
    const isSuccess = await DeleteItem(
      classroomId,
      deleteClassroom // apiden gelen silme fonksiyonu
    );

    if (isSuccess) {
      setClassrooms(
        classrooms.filter((classroom) => classroom.classroomId !== classroomId)
      );
    }
  };

  const handleUpdate = (id) => {
    console.log(id, "update id'si");
    navigate(`../../classroom/classroomUpdate/${id}`);
  };

  const handleDetail = (id) => {
    console.log(id, "update id'si");
    navigate(`../../classroom/classroomdetail/${id}`);
  };

  const handleStudentAddTFromClassroom = (id) => {
    const selected = classrooms.find(
      (classroom) => classroom.classroomId === id
    );
    const groupName = selected ? selected.name : "Grup bulunamadı";
    console.log(id, "update id'si");
    console.log("Group Name:", groupName);
    navigate(`../../classroom/studentassignment/${id}`);
  };
  const handleTrainerAddTFromClassroom = (id) => {
    const selected = classrooms.find(
      (classroom) => classroom.classroomId === id
    );
    const groupName = selected ? selected.name : "Grup bulunamadı";
    console.log(id, "update id'si");
    console.log("Group Name:", groupName);
    navigate(`../../classroom/trainerassignment/${id}`);
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
      accessor: "classroomName",
      Cell: ({ value, row }) => {
        const [participantsData, setParticipantsData] = useState(null);

        useEffect(() => {
          const fetchData = async () => {
            try {
              const studentsResponse = await getClassroomStudents(
                row.original.id
              );
              const trainersResponse = await getClassroomTrainers(
                row.original.id
              );

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
                            {index + 1}- {student.firstName} {student.lastName}
                            {index < participantsData.students.length - 1 && (
                              <br />
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="error-text">
                          Sınıfa öğrenci atanmamış.
                        </span>
                      )}
                      <br />
                      <br />
                      Eğitmenler
                      <br />
                      {participantsData.trainers.length > 0 ? (
                        participantsData.trainers.map((trainer, index) => (
                          <span key={index} className="title-text">
                            {index + 1}- {trainer.firstName} {trainer.lastName}
                            {index < participantsData.trainers.length - 1 && (
                              <br />
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="error-text">
                          Sınıfa eğitmen atanmamış.
                        </span>
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
      accessor: "groupTypeName",
    },
    {
      Header: "Şube",
      accessor: "branchName",
    },
    {
      Header: "Eğitim Tipi",
      accessor: "trainingTypeName",
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
      {Array.isArray(classrooms) && classrooms.length > 0 ? (
        <div style={{ width: "90vh" }}>
          <DataTable columns={columns} data={classrooms} />
        </div>
      ) : (
        <div className="es-no-data">
          <div>
            <h2>Henüz bu eğitime grup eklenmedi...</h2>
          </div>
          <div className="row-button-es">
            {id && (
              <button className="btn btn-create" onClick={handleCreate}>
                Ekle
              </button>
            )}
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
}

export default EducationGroupList;
