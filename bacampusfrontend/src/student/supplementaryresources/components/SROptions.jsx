import React, { useEffect, useState } from "react";
import { getClassroomsByStudentId } from "../../myclassroom/api/myClassroomApi";
import "../scss/sr-options.scss";
import "react-toastify/dist/ReactToastify.css";
import ToastContent from "../../../shared/toast-content/ToastContent";
import { useNavigate } from "react-router-dom";
import { FcFolder } from "react-icons/fc";
import { CgFileDocument } from "react-icons/cg";
import { PiFileVideoBold } from "react-icons/pi";

function SROptions() {
  const [data, setData] = useState([]);
  const [defaultMessage, setDefaultMessage] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const navigate = useNavigate();

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };

  const handleSRDocument = (educationId) => {
    navigate(`../supplementaryresourcedocumentlist/${educationId}`);
  };

  const handleSRVideo = (educationId) => {
    navigate(`../supplementaryresourcevideolist/${educationId}`);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getClassroomsByStudentId();
        const filteredClassrooms = response.data.filter(
          (item) => item.status !== "3"
        );

        if (filteredClassrooms.length > 0) {
          setClassrooms(filteredClassrooms);
        }
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

  return (
    <div>
      <div>
        <h1>Eğitimlere Bağlı Kaynaklar</h1>
        <img
          className="line"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAAAAAAAAPlDu38AAAAJcEhZcwAAAGAAAABgAPBrQs8AAAAHdElNRQfnCAgBJgGHSjsxAAAAKElEQVRIx2NgGAWjYBQMMGBMdk5YlrAsKWmgHMA00CEwCkbBKBhwAAC3jQN6lrQ8EgAAAABJRU5ErkJggg=="
          alt=""
        />
      </div>
      <div className="sr-card-container">
        {classrooms.map((classroom) => (
          <div key={classroom.id} className="sroptions-card">
            <div className="sroptions-listcard-header">
              <FcFolder style={{ minWidth: "70px", minHeight: "70px" }} />
              <div className="card-information-sr">
                <div>
                  <h3 className="sr-eduaction-name">
                    {classroom.educationName}
                  </h3>
                </div>
                <div>
                  <h3 style={{ color: "grey" }}>{classroom.classroomName}</h3>
                </div>
              </div>
              <div className="sroptions-card-body">
                <CgFileDocument
                  className="sr-button "
                  onClick={() => handleSRDocument(classroom.educationId)}
                />
                <PiFileVideoBold
                  className="sr-button"
                  onClick={() => handleSRVideo(classroom.educationId)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SROptions;
