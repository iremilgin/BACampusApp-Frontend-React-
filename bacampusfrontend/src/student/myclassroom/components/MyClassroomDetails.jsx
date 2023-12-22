import React, { useEffect, useState } from "react";
import "../scss/myclassroom-details.scss";
import DataTable from "../../../shared/data-table/DataTable";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import { BsGear, BsChevronCompactDown } from "react-icons/bs";
import {
  getStudentsByClassroomId,
  getTrainersByClassroomIdAsync,
} from "../api/myClassroomApi";
import { useParams, useNavigate } from "react-router-dom";
import ToastContent from "../../../shared/toast-content/ToastContent";

const MyClassroomDetails = () => {
  const { id } = useParams();
  const [defaultMessage, setDefaultMessage] = useState("");
  const navigate = useNavigate();

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };

  const [students, setStudents] = useState([]);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStudentsByClassroomId(id);
        setStudents(response.data);
      } catch (error) {
        setDefaultMessage(error.validationErrors.message);
        showToast(defaultMessage, "error");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTrainersByClassroomIdAsync(id);
        setTrainers(response.data);
      } catch (error) {
        if (error.name === "RedirectError") {
          navigate("/error"); // Redirect to ErrorPage
        }
        setDefaultMessage(error.validationErrors.message);
        showToast(defaultMessage, "error");
      }
    };
    fetchData();
  }, []);
  const handleDetail = (id) => {
    navigate(`../studentdetails/${id}`);
  };
  const handleDropdownAction = (option, id) => {
    if (option === "Detay") {
      handleDetail(id);
    }
  };
  const columns = [
    {
      Header: "Resim",
      accessor: "image",
      Cell: ({ value }) => (
        <img
          src={value ? value : require("../img/avatar.png")}
          alt="Resim"
          style={{ width: "60px", minHeight: "50px", borderRadius: "50%" }}
        />
      ),
    },
    {
      Header: "Adı",
      accessor: "firstName",
    },
    {
      Header: "Soyadı",
      accessor: "lastName",
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
            options={["Detay"]}
            onOptionClick={(option) =>
              handleDropdownAction(option, row.original.id)
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div className="myclassroom-container">
      <div>
        <h1>Sınıf Detay</h1>
        <img
          class="line"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAAAAAAAAPlDu38AAAAJcEhZcwAAAGAAAABgAPBrQs8AAAAHdElNRQfnCAgBJgGHSjsxAAAAKElEQVRIx2NgGAWjYBQMMGBMdk5YlrAsKWmgHMA00CEwCkbBKBhwAAC3jQN6lrQ8EgAAAABJRU5ErkJggg=="
          alt=""
        ></img>
      </div>
      <h2 className="header-margin">Eğitmenler</h2>

      <div className="myclassroom-trainer-details">
        {trainers.length > 0 ? (
          trainers.map((trainer) => (
            <div key={trainer.id} className="card-container">
              {trainer.image ? (
                <img className="round" src={trainer.image} alt="resim" />
              ) : (
                <img
                  src={require("../img/avatar.png")}
                  className="round"
                  alt="resim"
                />
              )}
              <h3>
                {trainer.firstName} {trainer.lastName}
              </h3>
              <p>
                {trainer.phoneNumber} <br /> {trainer.email}
              </p>
            </div>
          ))
        ) : (
          <p>Henüz eğitmen atanmamıştır..</p>
        )}
      </div>

      <h2 className="header-margin">Öğrenciler</h2>
      {Array.isArray(students) && students.length > 0 ? (
        <DataTable columns={columns} data={students} />
      ) : (
        <p>Veriler yükleniyor, Lütfen bekleyiniz.</p>
      )}
      <div style={{ height: "50px" }}></div>
      {showToast(defaultMessage, "error")}
    </div>
  );
};

export default MyClassroomDetails;
