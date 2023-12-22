import React, { useEffect, useState } from "react";
import "../scss/myclassroom-details.scss";
import { getDetailsByStudentId } from "../api/myClassroomApi";
import { useParams, useNavigate } from "react-router-dom";
import ToastContent from "../../../shared/toast-content/ToastContent";
import { IoPersonSharp, IoMail } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import { FaBirthdayCake } from "react-icons/fa";
const StudentDetails = () => {
  const { id } = useParams();
  const [defaultMessage, setDefaultMessage] = useState("");
  const navigate = useNavigate();

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };

  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDetailsByStudentId(id);
        setStudents(response.data);
      } catch (error) {
        setDefaultMessage(error.validationErrors.message);
        showToast(defaultMessage, "error");
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Öğrenci Detay</h1>
      <div>
        <img
          class="line"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAAAAAAAAPlDu38AAAAJcEhZcwAAAGAAAABgAPBrQs8AAAAHdElNRQfnCAgBJgGHSjsxAAAAKElEQVRIx2NgGAWjYBQMMGBMdk5YlrAsKWmgHMA00CEwCkbBKBhwAAC3jQN6lrQ8EgAAAABJRU5ErkJggg=="
          alt=""
        ></img>
      </div>
      <div className="student-detail-container">
        <div>
          {students.image ? (
            <img src={students.image} alt="resim" className="student-image" />
          ) : (
            <img src={require("../img/avatar.png")} className="student-image" alt="resim" />
          )}
        </div>
        <div>
          <h2 className="header-margin">
            <IoPersonSharp /> {students.fullName}
          </h2>
          <h3 className="header-margin">
            <IoMail /> {students.email}
          </h3>
          <h3 className="header-margin">
            <FaPhone /> {students.countryCode} {students.phoneNumber}
          </h3>
          <h3 className="header-margin">
            <FaBirthdayCake />{" "}
            {new Date(students.dateOfBirth).toLocaleDateString()}
          </h3>
        </div>
      </div>

      {showToast(defaultMessage, "error")}
    </div>
  );
};

export default StudentDetails;
