import React, { useEffect, useState } from "react";
import "../scss/myclassroom-list.scss";
import { useNavigate } from "react-router-dom";
import { BsGear } from "react-icons/bs";
import Dropdown from "../../../shared/buttons/drop-downs/DropDown";
import { getClassroomsByStudentId } from "../api/myClassroomApi";
import { CiCalendarDate } from "react-icons/ci";
import ToastContent from "../../../shared/toast-content/ToastContent";

const MyClassroomList = () => {
  const [defaultMessage, setDefaultMessage] = useState("");

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };

  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getClassroomsByStudentId();
        setClassrooms(response.data);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        setDefaultMessage(error.validationErrors.message);
        showToast(defaultMessage, "error");
      }
    };
    fetchData();
  }, []);

  const navigate = useNavigate();
  const handleDetail = (id) => {
    navigate(`../myclassroomdetails/${id}`);
  };

  const handleDropdownAction = (option, id) => {
    if (option === "Detay") {
      handleDetail(id);
    }
  };
  return (
    <div>
      <div>
        <h1>Sınıfım</h1>
        <img class="line" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAAAAAAAAPlDu38AAAAJcEhZcwAAAGAAAABgAPBrQs8AAAAHdElNRQfnCAgBJgGHSjsxAAAAKElEQVRIx2NgGAWjYBQMMGBMdk5YlrAsKWmgHMA00CEwCkbBKBhwAAC3jQN6lrQ8EgAAAABJRU5ErkJggg==" alt=""></img>
      </div>
      {classrooms.map((classroom) => (
        <div>
          <div
            className={`myclassroom-menu ${
              classroom.status === 4
                ? "myclassroom-active"
                : classroom.status === 3
                ? "myclassroom-passive"
                : "myclassroom-default"
            }`}
          >
            {classroom.status === 4
              ? "Aktif"
              : classroom.status === 3
              ? "Pasif"
              : null}
          </div>
          <div key={classroom.classroomId} className="myclassroom-card">
            <div className="myclassroom-listcard-header">
              <h2>{classroom.classroomName}</h2>
            </div>
            <div className="myclassroom-card-body">
              <p>{classroom.educationName}</p>
              <p className="myclassroom-detail-information">
                {classroom.branchName}-{classroom.trainingTypeName}-
                {classroom.groupTypeName}
              </p>
              <div className="myclassroom-card-icon">
                <div>
                  <CiCalendarDate className="date-icon" />
                  <span>
                    {new Date(classroom.openDate).toLocaleDateString()}
                  </span>
                  -
                  <span>
                    {new Date(classroom.closedDate).toLocaleDateString()}
                  </span>
                </div>
                <Dropdown
                  customClassName="myclassname-option"
                  triggerText={
                    <span>
                      <BsGear className="gear-setting" />
                    </span>
                  }
                  options={["Detay"]}
                  onOptionClick={(option) =>
                    handleDropdownAction(option, classroom.id)
                  }
                />
              </div>
            </div>
          </div>
          {showToast(defaultMessage, "error")}
        </div>
      ))}
    </div>
  );
};

export default MyClassroomList;
