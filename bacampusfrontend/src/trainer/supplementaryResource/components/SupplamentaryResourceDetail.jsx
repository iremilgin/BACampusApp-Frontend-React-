import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getResourceById,
  downloadFileSupplementaryResource,
  listAllSupplementaryResourcesTags,
  listAllSupplementaryResourcesEducationSubjects,
} from "../api/suplamentaryResourceApi";
import { getAlllTag, getTagById } from "../../tag/tagApi";

import ToastContent from "../../../shared/toast-content/ToastContent";
import {
  FaFilePdf,
  FaFileArchive,
  FaFile,
  FaEdit,
  FaDownload,
} from "react-icons/fa";

const ResourceDetails = () => {
  const [resource, setResource] = useState(null);
  const [educations, setEducations] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setselectedTags] = useState([]);
  const [selectedEducations, setselectedEducations] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [apiMessageError, setApiMessageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [educationErrorMessage, setEducationErrorMessage] = useState("");
  const [tagErrorMessage, setTagErrorMessage] = useState("");
  const [downloadErrorMessage, setDownloadErrorMessage] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };
  const handleUpdate = (id) => {
    navigate(`/trainer/supplementaryresource/trainersupplementaryresourceupdate/${id}`);
  };

  const convertFileToUrl = (data, fileType) => {
    const blob = new Blob([data.data], { type: fileType });
    return URL.createObjectURL(blob);
  };

  const handleDownloadFile = async (filePath, id) => {
    try {
      const fileResponse = await downloadFileSupplementaryResource(
        filePath,
        id
      );

      if (fileResponse.status == 200) {
        const url = convertFileToUrl(fileResponse, fileResponse.data.type);
        window.open(url);
      } else if (fileResponse.status == 404) {
        throw new Error("Dosyaya ulaşılamadı");
      } else {
        throw new Error("Bilinmeyen bir hata oluştu");
      }
    } catch (error) {
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
      setDownloadErrorMessage("Download error");
      showToast(downloadErrorMessage, "error");
    }
  };

  useEffect(() => {
    if (apiMessageError) {
      showToast(apiMessageError, "error");
    } else if (defaultMessage) {
      showToast(defaultMessage, "error");
    }
  }, [apiMessageError, defaultMessage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getResourceById(id);
        setResource(response);
        if (response ) {
          const educationSubjects =
          response.supplementaryResourceEducationSubjects ;
            const subjects = educationSubjects.map((item) => ({
            id: item.subjectId,
            name: item.subjectName,
          }));
          const educations = educationSubjects.map((item) => ({
            id: item.educationId,
            name: item.educationName,
          }));

          setSelectedSubjects(subjects);
          setselectedEducations(educations);
        }
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
          setDefaultMessage(error.defaultMessage);
          if (error.validationErrors.message) {
            setApiMessageError(error.validationErrors.message);
          } else {
            setApiMessageError("");
          }
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchTagData = async () => {
      try {
        const response = await listAllSupplementaryResourcesTags();
        const filteredTags = response.data.filter(
          (tag) => tag.supplementaryResourceId === id
        );
        setTags(filteredTags);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        setTagErrorMessage("Etiketler alınırken hata oluştu");
        showToast(tagErrorMessage, "error");
      }
    };
    fetchTagData();
  }, []);

  useEffect(() => {
    const fetchSelectedTags = async () => {
      try {
        const tagsIds = tags.map((x) => x.tagId);
        const fetchDataForTags = tagsIds.map((tagId) => getTagById(tagId));
        const tagsData = await Promise.all(fetchDataForTags);

        setselectedTags(tagsData);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        setDownloadErrorMessage("Download error");
        showToast(downloadErrorMessage, "error");
      }
    };
    if (tags?.length > 0) fetchSelectedTags();
  }, [tags]);

  if (!resource) {
    return <div>Loading...</div>;
  }

  return (
    <div className="supplementary-details-container">
      <h1>Kaynak Detay</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      <span className="supplementary-topic-name">{resource.name}</span>
      <div className="supplementary-details-header">
        <div className="icon-container">
          <div className="header-icon">
            {resource.fileURL ? (
              resource.fileURL.split(".").pop() === "pdf" ? (
                <img src={require("../../../assets/img/pdf.png")} alt="" />
              ) : resource.fileURL.split(".").pop() === "zip" ? (
                <img src={require("../../../assets/img/zip.png")} alt="" />
              ) : resource.fileURL.split(".").pop() === "mp4" ? (
                <img src={require("../../../assets/img/mov.png")} alt="" />
              ) : resource.fileURL.startsWith("http://") ||
                resource.fileURL.startsWith("https://") ? (
                <img src={require("../../../assets/img/wmv.png")} alt="" />
              ) : (
                <img src={require("../../../assets/img/folder.png")} alt="" />
              )
            ) : null}
          </div>
          <div className="icon-actions">
            <FaEdit
              size="2em"
              className="edit-icon"
              onClick={() => handleUpdate(id)}
            />
            <FaDownload
              size="2em"
              className="download-icon"
              onClick={() => handleDownloadFile(resource.fileURL, resource.id)}
            />
          </div>
        </div>
        <div className="details-wrapper">
          <span className="supplementary-details-education-tittle">
            Dersler :
          </span>
          {
            <span className="supplementary-details-educations">
              {" "}
              {selectedEducations &&
                Array.from(
                  new Set(selectedEducations.map((education) => education.name))
                ).join(", ")}
            </span>
          }
          <img
            className="line"
            src={require("../../../assets/img/substract.png")}
            alt=""
          />
          <span htmlFor="referenceFile" className="supplementary-details-title">
            {resource.fileURL && resource.resourceType === 1
              ? "Dosya:"
              : resource.resourceType === 2 &&
                resource.fileURL !== "Deleted_File"
              ? "Video:"
              : resource.resourceType === 3 &&
                resource.fileURL !== "Deleted_File"
              ? "Link:"
              : resource.fileURL === "Deleted_File"
              ? "Dosya Silinmiş:"
              : "Dosya Yok:"}
          </span>
          <span className="supplementary-details-label">
            {(resource.fileURL && resource.resourceType === 1) ||
            resource.resourceType === 2 ? (
              <a
                className="supplementary-details-file"
                href="#"
                onClick={() =>
                  handleDownloadFile(resource.fileURL, resource.id)
                }
              >
                {resource.fileURL.split(".").pop() === "pdf"
                  ? "PDF Dosyasını Aç"
                  : resource.fileURL.split(".").pop() === "zip"
                  ? "Zip Dosyasını Aç"
                  : resource.fileURL.split(".").pop() === "mp4"
                  ? "Video Dosyasını Aç"
                  : "Dosyayı Aç"}
              </a>
            ) : resource.fileURL &&
              resource.resourceType === 3 &&
              resource.fileURL !== "Deleted_File" ? (
              <a
                className="supplementary-details-file"
                href={resource.fileURL}
                target="_blank"
              >
                {resource.fileURL}
              </a>
            ) : resource.fileURL === "Deleted_File" ? (
              "Dosya Silinmiş"
            ) : (
              "Dosya Yok"
            )}
          </span>
          <img
            className="line"
            src={require("../../../assets/img/substract.png")}
            alt=""
          />
           <span className="supplementary-details-subjects-tittle">Konular:</span>
        <span className="supplementary-details-subjects">
          {selectedSubjects.map((subject) => subject.name).join(", ")}
        </span>

          <img
            className="line"
            src={require("../../../assets/img/substract.png")}
            alt=""
          />
          <span className="supplementary-details-tag-tittle">Etiketler :</span>
          <span className="supplementary-details-tags">
            {" "}
            {selectedTags.map((tag) => tag.data.name).join(", ")}
          </span>
          <img
            className="line"
            src={require("../../../assets/img/substract.png")}
            alt=""
          />
          {showToast(apiMessageError, "error")}
          {showToast(defaultMessage, "error")}
          {showToast(successMessage, "success")}
          {showToast(educationErrorMessage, "error")}
          {showToast(tagErrorMessage, "error")}
        </div>
      </div>
      <div className="form-buttons">
      <Link
            className="submit-button backto-list"
            to={"/trainer/supplementaryresource/trainersupplementaryresourcelist"}
          >
            Listeye Dön
          </Link>
      </div>
    </div>
  );
};

export default ResourceDetails;
