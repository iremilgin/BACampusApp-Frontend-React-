import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import {
  getResourceById,
  updateResources,
  downloadFileSupplementaryResource,
} from "../api/suplamentaryResourceApi";
import { ListByEducationtId } from "../../education-subject/api/educationSubjectApi";
import { getAlllTag } from "../../tag/api/tagApi";

import { getAllEducationThatHaveEducationSubjects } from "../../education/api/educationApi";
import { getAllSubject } from "../../subject/api/subjectApi";

import { MultipleAutoComplete } from "../components/MultipleAutoCompleteTagsUpdate";
import ToastContent from "../../../shared/toast-content/ToastContent";
import "../scss/subject-update.scss";
import { RiUploadCloudFill } from "react-icons/ri";
import { MultipleAutoCompleteEducationUpdate } from "./MultipleAutoCompleteEducationUpdate";
import { MultipleAutoCompleteSubjectUpdate } from "./MultipleAutoCompleteSubjectUpdate";

const ResourceUpdate = () => {
  const [name, setName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [educations, setEducations] = useState([]);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedEducations, setSelectedEducations] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [referanceFile, setReferanceFile] = useState("");
  const [submitReferanceFile, setSubmitReferanceFile] = useState("");
  const { id } = useParams();
  const [SupplamentaryResource, setSupplamentaryResource] = useState("");
  const [resourceType, setResourceType] = useState(1);
  const [submitResourceType, setSubmitResourceType] = useState(1);
  const [link, setLink] = useState("");
  const [submitLink, setSubmitLink] = useState("");
  const [tagsError, setTagsError] = useState("");
  const [subjectsError, setSubjectsError] = useState("");
  const [educationsError, setEducationsError] = useState("");
  const [nameError, setNameError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [apiMessageError, setApiMessageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [otherSuccessMessage, setOtherSuccessMessage] = useState("");
  const [educationErrorMessage, setEducationErrorMessage] = useState("");
  const [subjectErrorMessage, setSubjectErrorMessage] = useState("");
  const [tagErrorMessage, setTagErrorMessage] = useState("");
  const [otherErrorMessage, setOtherErrorMessage] = useState("");
  const [downloadErrorMessage, setDownloadErrorMessage] = useState("");
  const fileInputRef = useRef();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;

    if (droppedFiles.length > 0) {
      setSubmitResourceType(1); // Dosya tipi
      setSubmitReferanceFile(droppedFiles[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileInputChange = (event) => {
    setSubmitResourceType(1); // Dosya tipi
    setSubmitReferanceFile(event.target.files[0]);
  };

  const handleVideoInputChange = (event) => {
    setSubmitResourceType(2); // Dosya tipi
    setSubmitReferanceFile(event.target.files[0]);
  };

  const showToast = (message, type) => {
    return <ToastContent message={message} type={type} />;
  };

  useEffect(() => {
    if (apiMessageError) {
      showToast(apiMessageError, "error");
    } else if (defaultMessage) {
      showToast(defaultMessage, "error");
    }
  }, [apiMessageError, defaultMessage]);

  // useEffect(() => {
  //   getResourceById(id)
  //     .then((data) => setSupplamentaryResource(data))
  //     .catch((error) => {
  //       setDefaultMessage(error.defaultMessage);
  //       if (error.validationErrors.message) {
  //         setApiMessageError(error.validationErrors.message);
  //       } else {
  //         setApiMessageError("");
  //       }
  //     });
  // }, []);

  useEffect(() => {
    getResourceById(id)
      .then((data) => {
        
        setSupplamentaryResource(data);
        setName(data.name);
        setReferanceFile(data.fileURL);
        setResourceType(data.resourceType);
        setLink(data.link);
        setSubmitResourceType(data.resourceType);
        setLink(data.link);
        setSubmitReferanceFile(data.fileURL);
        const initialSelectedTags = data.supplementaryResourceTags.map(
          (tag) => tag.tagId
        );
        setSelectedTags(initialSelectedTags);
       
        
        
        const initialSelectedSubjects = data.supplementaryResourceEducationSubjects.map(
          (subject) => subject.subjectId
        );
        setSelectedSubjects(initialSelectedSubjects);

        
        
        
        const initialSelectedEducations = [...new Set(data.supplementaryResourceEducationSubjects.map(
          (education) => education.educationId
        ))];
        setSelectedEducations(initialSelectedEducations);
        
      
    
      })


      .catch((error) => {
        setDefaultMessage(error.defaultMessage);
        if (error.validationErrors.message) {
          setApiMessageError(error.validationErrors.message);
        } else {
          setApiMessageError("");
        }
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
      });
  }, [id]);

  const handleOptionChange = (event) => {
    const selectedOptionEvent = event.target.value;
    setSelectedOption(selectedOptionEvent);
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
      if (fileResponse.status === 200) {
        const url = convertFileToUrl(fileResponse, fileResponse.data.type);
        window.open(url);
      } else if (fileResponse.status === 404) {
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

  const handleTagIdSelecting = (tagIds) => {
    setSelectedTags(tagIds);
  };
  const handleSubjectIdSelecting = (subjectIds) => {
    setSelectedSubjects(subjectIds);
  };
  const handleEducationIdSelecting = (educationIds) => {
    setSelectedEducations(educationIds);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("fileURL", submitReferanceFile);
    formData.append("link", submitLink);
    formData.append("resourceType", submitResourceType);
    formData.append("isHardDelete", resourceType === 2 ? true : false);
    const flatTags = selectedTags.flat();
    flatTags.forEach((element, index) => {
      formData.append(`tags[${index}]`, element);
    });
    const flatEducations = selectedEducations.flat();
    flatEducations.forEach((element, index) => {
      formData.append(`educations[${index}]`, element);
    });
    const flatSubjects = selectedSubjects.flat();
    flatSubjects.forEach((element, index) => {
      formData.append(`subjects[${index}]`, element);
    });
    try {
      setTagsError("");
      setEducationsError("");
      setSubjectsError("");
      setNameError("");
      const result = await updateResources(formData);
      const message = result.data.message;
      setSuccessMessage(message);
      showToast(message, "success");
      setTimeout(() => {
        navigate("../../supplementaryresource");
      }, 2000);
    } catch (error) {
      setDefaultMessage(error.defaultMessage);

      if (error.validationErrors.Tags) {
        setTagsError(error.validationErrors.Tags);
      } else {
        setTagsError("");
      }
      if (error.validationErrors.message) {
        setApiMessageError(error.validationErrors.message);
      } else {
        setApiMessageError("");
      }if (error.validationErrors.Educations) {
        setEducationsError(error.validationErrors.Educations);
      } else {
        setEducationsError("");
      }if (error.validationErrors.Subjects) {
        setSubjectsError(error.validationErrors.Subjects);
      } else {
        setSubjectsError("");
      }
      if (error.validationErrors.Name) {
        setNameError(error.validationErrors.Name);
      } else {
        setNameError("");
      }
      if (error.name === 'RedirectError') {
        navigate('/error'); // Redirect to ErrorPage
      } 
    }
  };

  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const response = await getAllEducationThatHaveEducationSubjects();
        setEducations(response);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        setEducationErrorMessage("Eğitimler alınırken hata oluştu");
        showToast(educationErrorMessage, "error");
      }
    };
    fetchEducationData();
  }, []);

  useEffect(() => {
    const fetchSubjectData = async (educationIds) => {
      try {
        setSubjects([]); // Önceki konuları temizle
        for (const educationId of educationIds) {
          const response = await ListByEducationtId(educationId);
          if (response.isSuccess) {
            const newSubjects = response.data;
            setSubjects((prevSubjects) => [...prevSubjects, ...newSubjects]); // Yeni konuları ekle
          }
        }
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        if (error.response && error.response.data.isSuccess === false) {
          showToast(apiMessageError, "error");
        }
        setSubjects([]);
      }
    };

    if (selectedEducations.length > 0) {
      fetchSubjectData(selectedEducations);
    }

  }, [selectedEducations]);

  useEffect(() => {
    const fetchTagData = async () => {
      try {
        const response = await getAlllTag();
        setTags(response);
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
    // Mevcut resourceType'a göre selectedOption'ı belirle
    setSelectedOption(
      resourceType === 1 ? "Dosya Seç" : resourceType === 2 ? "Video Ekle" : "Link Ekle"
    );
  }, [resourceType]); // resourceType değiştiğinde bu useEffect çalışacak

  return (
    <div className="homework-form-container">
      <h1>Kaynak Güncelle</h1>
      <img
        className="line"
        src={require("../../../assets/img/substract.png")}
        alt=""
      />
      <form className="card-body" onSubmit={handleSubmit}>
        <div className="form-field">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="name" className="form-label">
                  Kaynak Adı:
                </label>
                <input
                  className="form-input"
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
              </div>
              <div>
              {nameError && <div className="error-message">{nameError}</div>}
              </div>
            </div>
          </div>
        </div>
        <div className="form-fields">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="referanceFile" className="form-label">
                  Kaynak Dosyası:
                </label>
                {resourceType === 1 || resourceType === 2 ? (
                  <span className="form-label-small-sp">
                    {referanceFile ? (
                      <a
                        className="form-input"
                        href="#"
                        onClick={() =>
                          handleDownloadFile(
                            referanceFile,
                            SupplamentaryResource.id
                          )
                        }
                      >
                        {referanceFile.split(".").pop() === "pdf"
                          ? "PDF Dosyasını Aç"
                          : referanceFile.split(".").pop() === "zip"
                          ? "Zip Dosyasını Aç"
                          : referanceFile.split(".").pop() === "mp4"
                          ? "Video Dosyasını Aç"
                          : "Dosyayı Aç"}
                      </a>
                    ) : (
                      "Dosya yok"
                    )}
                  </span>
                ) : resourceType === 3 ? (
                  <span className="form-label-small-sp">
                  <a href={SupplamentaryResource.fileURL} target="_blank" className="form-input">
                    Link Aç
                  </a>
                  </span>
                ) : (
                  "Dosya Yok"
                )}
              </div>
            </div>
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="educationId" className="form-label right-label">
                  Eğitim Seç:
                </label>
                <div className="form-input">
                  {educations !== undefined && (
                    <MultipleAutoCompleteEducationUpdate
                      educations={educations}
                      onEducationIdSelecting={handleEducationIdSelecting}
                      selectedEducations={selectedEducations}
                    />
                  )}
                </div>
              </div>
              {educationsError && <div className="error-message">{educationsError}</div>}
            </div>
          </div>
        </div>
        <div className="form-fields">
          <div className="trainer-row">
            <div className="trainer-row-space">
              
              <div>
                {selectedOption === "Dosya Seç" && (
                  <div className="input-container">
                    <label htmlFor="referansDosya" className="form-label">
                      Dosya Ekle:
                    </label>
                    <div
                      className="drag-drop-area"
                      onDrop={(e) => handleDrop(e)}
                      onDragOver={(e) => handleDragOver(e)}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <RiUploadCloudFill
                        size={35}
                        className=""
                        color="#337ab7"
                      />
                      <p>Dosyayı sürükle ve bırak veya tıkla</p>
                      <input
                        ref={fileInputRef}
                        className="form-input"
                        type="file"
                        id="referanceFile"
                        onChange={(e) => handleFileInputChange(e)}
                        style={{ display: "none" }}
                      />
                      {submitReferanceFile && (
                        <p> Seçilen Dosya: {submitReferanceFile.name}</p>
                      )}
                    </div>
                  </div>
                )}
                {selectedOption === "Video Ekle" && (
                  <div className="input-container">
                    <label htmlFor="referansDosya" className="form-label">
                      Video Ekle:
                    </label>
                    <div
                      className="drag-drop-area"
                      onDrop={(e) => handleDrop(e)}
                      onDragOver={(e) => handleDragOver(e)}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <RiUploadCloudFill
                        size={35}
                        className=""
                        color="#337ab7"
                      />
                      <p>Dosyayı sürükle ve bırak veya tıkla</p>
                      <input
                        ref={fileInputRef}
                        className="form-input"
                        type="file"
                        id="referanceFile"
                        onChange={(e) => handleVideoInputChange(e)}
                        style={{ display: "none" }}
                      />
                      {submitReferanceFile && (
                        <p> Seçilen Dosya: {submitReferanceFile.name}</p>
                      )}
                    </div>
                  </div>
                )}
                {selectedOption === "Link Ekle" && (
                  <div className="input-container">
                    <label htmlFor="referansLink" className="form-label">
                      Link Ekle:
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      id="link"
                      value={link}
                      onChange={(e) => {
                        setSubmitResourceType(3);
                        setSubmitLink(e.target.value);
                      }}
                    />
                  </div>
                )}
                <input type="hidden" name="resourceType" value={resourceType} />
              </div>
            </div>
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="subjectId" className="form-label right-label">
                  Konu Seç:
                </label>
                <div className="form-input">
                  {subjects !== undefined && (
                    <MultipleAutoCompleteSubjectUpdate
                      subjects={subjects}
                      onSubjectIdSelecting={handleSubjectIdSelecting}
                      selectedSubjects={selectedSubjects}
                    />
                  )}
                </div>
              </div>
              {subjectsError && <div className="error-message">{subjectsError}</div>}
            </div>
          </div>
        </div>
        <div className="form-field">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="subjectId" className="form-label">
                  Etiket Seç:
                </label>
                <div className="form-input">
                  {tags !== undefined && (
                    <MultipleAutoComplete
                      tags={tags}
                      onTagIdSelecting={handleTagIdSelecting}
                      selectedTags={selectedTags}
                    />
                  )}
                </div>
              </div>
              <div>
                {tagsError && <div className="error-message">{tagsError}</div>}
              </div>
            </div>
          </div>
        </div>
        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}
        <div className="buttons-form">
          <input type="submit" value="Güncelle" className="submit-button" />
          <Link
            className="submit-button backto-list"
            to={"/admin/supplementaryresource"}
          >
            Listeye Dön
          </Link>
        </div>
        {showToast(otherErrorMessage, "error")}
        {showToast(otherSuccessMessage, "success")}
        {showToast(educationErrorMessage, "error")}
        {showToast(tagErrorMessage, "error")}
      </form>
    </div>
  );
};

export default ResourceUpdate;
