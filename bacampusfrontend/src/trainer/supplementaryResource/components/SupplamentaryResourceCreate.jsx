import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { createSupplemantaryResource } from "../api/suplamentaryResourceApi";
import { ListByEducationtId } from "../../education-subject/educationSubjectApi";
import { getAllEducationThatHaveEducationSubjects } from "../../education/educationApi";
import { getAlllTag } from "../../tag/tagApi";
import { MultipleAutoComplete } from "../components/MultipleAutoCompleteTags";
import { MultipleAutoCompleteEducation } from "../components/MultipleAutoCompleteEducation";
import { MultipleAutoCompleteSubject } from "../components/MultipleAutoCompleteSubject";


import ToastContent from "../../../shared/toast-content/ToastContent";
import "../scss/subject-create.scss";
import { RiUploadCloudFill } from "react-icons/ri";

const ResourceCreate = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [educationId, setEducationsId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [educations, setEducations] = useState([]);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedEducations, setSelectedEducations] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [referanceFile, setReferanceFile] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [link, setLink] = useState("");

  const [fileUrlError, setfileUrlError] = useState("");
  const [tagsError, setTagsError] = useState("");
  const [subjectsError, setSubjectsError] = useState("");
  const [educationsError, setEducationsError] = useState("");
  const [nameError, setNameError] = useState("");
  const [apiMessageError, setApiMessageError] = useState("");
  const [defaultMessage, setDefaultMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [otherSuccessMessage, setOtherSuccessMessage] = useState("");
  const [otherErrorMessage, setOtherErrorMessage] = useState("");
  const [tagErrorMessage, setTagErrorMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState("Seçiniz");
  const fileInputRef = React.createRef();

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;

    if (droppedFiles.length > 0) {
      setResourceType(1); // Dosya tipi
      setReferanceFile(droppedFiles[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileInputChange = (event) => {
    setResourceType(1); // Dosya tipi
    setReferanceFile(event.target.files[0]);
  };
  const handleVideoInputChange = (event) => {
    setResourceType(2); // Dosya tipi
    setReferanceFile(event.target.files[0]);
  };

  const handleOptionChange = (event) => {
    const selectedOptionEvent = event.target.value;
    setSelectedOption(selectedOptionEvent);
    setFile("");
    setReferanceFile("");
    setLink("");
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };



  const handleTagIdSelecting = (tagIds) => {
    setSelectedTags(tagIds);
  };
  const handleEducationIdSelecting = (educationIds) => {
    setSelectedEducations([...educationIds]);
  };
  
  const handleSubjectIdSelecting = (subjectIds) => {
    setSelectedSubjects([...subjectIds]);
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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("fileURL", referanceFile);
    formData.append("resourceType", resourceType);
    formData.append("link", link);
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
      setfileUrlError("");
      setEducationsError("");
      setSubjectsError("");
      setNameError("");
      const result = await createSupplemantaryResource(formData);
      const message = result.data.message;
      setSuccessMessage(message);
      showToast(message, "success");
      setTimeout(() => {
        navigate("/trainer/supplementaryresource/trainersupplementaryresourcelist");
      }, 2000);
    } catch (error) {
      setDefaultMessage(error.defaultMessage);
      if (error.validationErrors.Tags) {
        setTagsError(error.validationErrors.Tags);
      } else {
        setTagsError("");
      }
      if (error.validationErrors.FileURL) {
        setfileUrlError(error.validationErrors.FileURL);
      } else {
        setfileUrlError("");
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
    const fetchSubjectData = async (educationIds) => {
      try {
        setSubjects([]); // Clear previous subjects
        for (const educationId of educationIds) {
          const response = await ListByEducationtId(educationId);
          if (response.isSuccess) {
            const newSubjects = response.data;
            setSubjects((prevSubjects) => [...prevSubjects, ...newSubjects]);
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
    const fetchEducationData = async () => {
      try {
        const response = await getAllEducationThatHaveEducationSubjects();
        setEducations(response);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        setOtherErrorMessage("Eğitimler alınırken hata oluştu ");
        showToast(otherErrorMessage, "error");
      }
    };
    fetchEducationData();
  }, []);

  useEffect(() => {
    const fetchTagData = async () => {
      try {
        const response = await getAlllTag();
        setTags(response);
      } catch (error) {
        if (error.name === 'RedirectError') {
          navigate('/error'); // Redirect to ErrorPage
        } 
        setTagErrorMessage("Etiketler alınırken hata oluştu ");
        showToast(tagErrorMessage, "error");
      }
    };
    fetchTagData();
  }, []);

  return (
    <div className="homework-form-container">
      <h1>Kaynak Ekle</h1>
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
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="educationId" className="form-label right-label">
                  Eğitim Seç:
                </label>
                <div className="form-input">
                  {educations !== undefined && (
                    <MultipleAutoCompleteEducation
                      educations={educations}
                      onEducationIdSelecting={handleEducationIdSelecting}
                    />
                  )}
              </div>
            </div>
            {educationsError && <div className="error-message">{educationsError}</div>}
          </div>
        </div>
        </div>

        <div className="form-field">
          <div className="trainer-row">
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="referanceFile" className="form-label">
                  Kaynak Tipi:
                </label>
                <select
                  id="fileOption"
                  value={selectedOption}
                  onChange={handleOptionChange}
                  className="form-input"
                >
                  <option value="Seçiniz" disabled>
                    {" "}
                    Seçiniz{" "}
                  </option>
                  <option value="Dosya Seç">Dosya Seç</option>
                  <option value="Video Ekle">Video Ekle</option>
                  <option value="Link Ekle">Link Ekle</option>
                </select>
              </div>
              <div>
                {selectedOption === "Dosya Seç" && (
                  <div className="input-container">
                    <label htmlFor="referansDosya" className="form-label">
                      Dosya Ekle
                    </label>
                    <div
                      className="drag-drop-area"
                      onDrop={(e) => handleDrop(e)}
                      onDragOver={(e) => handleDragOver(e)}
                      onClick={() => fileInputRef.current.click()} // Dosya seçmek için tıklandığında input'u tetikle
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
                        style={{ display: "none" }} // Dosya inputunu gizle
                      />
                      {referanceFile && (
                        <p> Seçilen Dosya: {referanceFile.name}</p>
                      )}
                    </div>
                  </div>
                )}
                 {selectedOption === "Video Ekle" && (
                  <div className="input-container">
                    <label htmlFor="referansDosya" className="form-label">
                      Video Ekle
                    </label>
                    <div
                      className="drag-drop-area"
                      onDrop={(e) => handleDrop(e)}
                      onDragOver={(e) => handleDragOver(e)}
                      onClick={() => fileInputRef.current.click()} // Dosya seçmek için tıklandığında input'u tetikle
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
                        style={{ display: "none" }} // Dosya inputunu gizle
                      />
                      {referanceFile && (
                        <p> Seçilen Dosya: {referanceFile.name}</p>
                      )}
                    </div>
                  </div>
                )}
                {selectedOption === "Link Ekle" && (
                  <div className="input-container">
                    <label htmlFor="referansLink" className="form-label">
                      Link Ekle
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      id="link"
                      value={link}
                      onChange={(e) => {
                        setResourceType(3);
                        setLink(e.target.value);
                      }}
                    />
                  </div>
                )}
                <input type="hidden" name="resourceType" value={resourceType} />
              </div>
              <div>
                {fileUrlError && (
                  <div className="error-message">{fileUrlError}</div>
                )}
              </div>
            </div>
            <div className="trainer-row-space">
              <div className="input-container">
                <label htmlFor="subjectId" className="form-label right-label">
                  Konu Seç:
                </label>
                <div className="form-input">
                  {subjects !== undefined && (
                    <MultipleAutoCompleteSubject
                    subjects={subjects}
                      onSubjectIdSelecting={handleSubjectIdSelecting}
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

        <div className="buttons-form">
          <input type="submit" value="Ekle" className="submit-button" />
          <Link
            className="submit-button backto-list"
            to={"/trainer/supplementaryresource/trainersupplementaryresourcelist"}
          >
            Listeye Dön
          </Link>
        </div>
        {defaultMessage && (
          <div className="error-message">{defaultMessage}</div>
        )}
        {showToast(apiMessageError, "error")}
        {showToast(defaultMessage, "error")}
        {showToast(successMessage, "success")}
        {showToast(otherSuccessMessage, "success")}
        {showToast(otherErrorMessage, "success")}
        {showToast(tagErrorMessage, "success")}
      </form>
    </div>
  );
};

export default ResourceCreate;
