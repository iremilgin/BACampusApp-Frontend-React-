import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "plyr/dist/plyr.css";
import Plyr from "plyr";
import {
  getDocumentsOrVideosByEducationId,
  downloadVideoSupplementaryResource,
} from "../../supplementaryResource/api/suplamentaryResourceApi";
import ToastContent from "../../../shared/toast-content/ToastContent";
import { FaPlay } from "react-icons/fa";
import "../scss/education-sr-video.scss";

const SupplementaryResourcePlayer = () => {
  const [supplementaryResources, setSupplementaryResources] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const { id } = useParams();
  const [resultMessage, setResultMessage] = useState("");
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [educationName, setEducationName] = useState("");
  const [lowVideo, setLowVideo] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDocumentsOrVideosByEducationId(id, 2);
        const sortedResources = sortResourcesByOrder(response.data);
        setSupplementaryResources(sortedResources);

        if (sortedResources.length > 0) {
          const firstVideo = sortedResources[0];
          handleDownloadAndPlay(firstVideo.fileURL, firstVideo.id, 2, 0);
          setEducationName(
            firstVideo.supplementaryResourceEducationSubjects[0]?.educationName
          );
        }
        setLoading(false);
      }  catch (error) {
        setLoading(false); 
        if (error.validationErrors.message) {
          setResultMessage(error.validationErrors.message);
          showToast(resultMessage, "error");
        } else {
          setResultMessage("");
        }
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        }
      }
    };
    fetchData();
  }, []);

  const sortResourcesByOrder = (resources) => {
    return resources.sort((a, b) => {
      const orderA = a.supplementaryResourceEducationSubjects
        .map((subject) => subject.order)
        .reduce((acc, order) => Math.min(acc, order), Infinity);

      const orderB = b.supplementaryResourceEducationSubjects
        .map((subject) => subject.order)
        .reduce((acc, order) => Math.min(acc, order), Infinity);

      return orderA - orderB;
    });
  };

  useEffect(() => {
    if (selectedVideo && videoRef.current) {
      if (!playerRef.current) {
        playerRef.current = new Plyr(videoRef.current);
      }

      const sources = [
        {
          src: lowVideo,
          type: "video/mp4",
          size: 360,
        },
        {
          src: selectedVideo,
          type: "video/mp4",
          size: 480,
        },
      ];

      playerRef.current.source = {
        type: "video",
        sources,
      };
    }
  }, [selectedVideo]);

  const handleDownloadAndPlay = async (filePath, id, quality, index) => {
    try {
      const fileResponse = await downloadVideoSupplementaryResource(
        filePath,
        id,
        quality
      );
      const lowQuality = await downloadVideoSupplementaryResource(
        filePath,
        id,
        1
      );

      setLowVideo(lowQuality);

      if (fileResponse.status === 200) {
        const url = convertFileToUrl(
          fileResponse.data,
          fileResponse.headers["content-type"]
        );
        setSelectedVideo(url);
        setSelectedVideoIndex(index);
      } else if (fileResponse.status === 404) {
        throw new Error("Dosyaya ulaşılamadı");
      } else {
        throw new Error("Bilinmeyen bir hata oluştu");
      }

      if (lowQuality.status === 200) {
        const lowUrl = convertFileToUrl(
          lowQuality.data,
          lowQuality.headers["content-type"]
        );
        setLowVideo(lowUrl);
      }
    } catch (error) {
      if (error.name === "RedirectError") {
        navigate("/error"); // Redirect to ErrorPage
      }
      setResultMessage(error.message || "Bilinmeyen bir hata oluştu");
    }
  };

  const convertFileToUrl = (data, fileType) => {
    const blob = new Blob([data], { type: fileType });
    return URL.createObjectURL(blob);
  };

  return (
    <div>
      <h1>Eğitim Videoları</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      {loading ? (
  <p>Veri yükleniyor...</p>
) : (
  <>
    {supplementaryResources.length === 0 ? (
      <p>Veri bulunamadı</p>
    ) : (
      <div className="youtube-like-container">
        <div className="video-player-container">
          <div>
            <div>
              <video ref={videoRef} controls crossOrigin="true" playsInline>
                <source src={selectedVideo} type="video/mp4" />
              </video>
              <h1 className="selected-video-name">
               {supplementaryResources[selectedVideoIndex].name}
              </h1>
              <h2 className="selected-video-subject">
               {supplementaryResources[selectedVideoIndex].supplementaryResourceEducationSubjects
                  .map((subject) => subject.subjectName)
                  .join(" - ")}
              </h2>
              
            </div>
          </div>
        </div>
        <div className="table-container-video">
          <h1 className="video-header">{educationName}</h1>
          <table className="table-hover">
            <thead>
              <tr>
                <th></th>
              </tr>
            </thead>
            <tbody className="tbody-setting">
              {supplementaryResources.map((resource, index) => (
                <tr key={resource.id}>
                  <td className="resource-td">
                    <div className="td_content">
                      <p className="resource-name-style">
                        {resource.name} - {resource.supplementaryResourceEducationSubjects
                          .map((subject) => subject.subjectName)
                          .join(", ")}
                      </p>
                      {/* <p className="subject-names">
                        {resource.supplementaryResourceEducationSubjects
                          .map((subject) => subject.subjectName)
                          .join(" - ")}
                      </p> */}
                      <button
                        type="button"
                        className="btnIzle"
                        style={{
                          backgroundColor: selectedVideoIndex === index ? "#E63338" : "#2196f3",
                          borderColor: selectedVideoIndex === index ? "#E63338" : "#2196f3",
                        }}
                        onClick={() =>
                          handleDownloadAndPlay(
                            resource.fileURL,
                            resource.id,
                            1,
                            index
                          )
                        }
                      >
                        <FaPlay className="play-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </>
)}

      {showToast(resultMessage, "error")}
    </div>
  );
};

export default SupplementaryResourcePlayer;
